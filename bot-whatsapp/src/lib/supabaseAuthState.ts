import { supabase } from './supabase.js'
import type {
  AuthenticationCreds,
  SignalDataTypeMap,
} from '@whiskeysockets/baileys'
import { initAuthCreds, BufferJSON, proto } from '@whiskeysockets/baileys'

// Lee varios datos de sesión de un tirón desde Supabase
async function leerDatos(ids: string[]): Promise<Record<string, unknown>> {
  if (ids.length === 0) return {}

  const { data, error } = await supabase
    .from('baileys_session')
    .select('id, data')
    .in('id', ids)

  if (error || !data) return {}

  const resultado: Record<string, unknown> = {}
  for (const fila of data) {
    resultado[fila.id] = JSON.parse(
      JSON.stringify(fila.data),
      BufferJSON.reviver,
    )
  }
  return resultado
}

// Guarda varios datos de sesión de un tirón en Supabase
async function guardarDatos(registros: Array<{ id: string; valor: unknown }>) {
  if (registros.length === 0) return

  const ahora = new Date().toISOString()
  const filas = registros.map((r) => ({
    id: r.id,
    data: JSON.parse(JSON.stringify(r.valor, BufferJSON.replacer)),
    updated_at: ahora,
  }))

  // upsert de a 100 rows por lote por el límite de Supabase
  const TAMANO_LOTE = 100
  for (let i = 0; i < filas.length; i += TAMANO_LOTE) {
    const lote = filas.slice(i, i + TAMANO_LOTE)
    const { error } = await supabase
      .from('baileys_session')
      .upsert(lote, { ignoreDuplicates: false })

    if (error) {
      console.error('❌ Error guardando lote en baileys_session:', error.message)
    }
  }
}

// Limpia claves de sesión viejas para que la tabla no crezca sin control
async function limpiarSessionVieja() {
  try {
    // 1. app-state-sync-key: mantener solo las últimas 5
    const { data: syncKeys } = await supabase
      .from('baileys_session')
      .select('id')
      .like('id', 'app-state-sync-key-%')
      .order('updated_at', { ascending: false })

    if (syncKeys && syncKeys.length > 5) {
      const ids = syncKeys.slice(5).map((r) => r.id)
      await borrarDatos(ids)
      console.log(`🧹 Limpiadas ${ids.length} app-state-sync-keys viejas`)
    }

    // 2. El resto (session, sender-key, pre-key huérfanas) +60 días
    const hace60Dias = new Date(
      Date.now() - 60 * 24 * 60 * 60 * 1000,
    ).toISOString()

    const { data: viejos } = await supabase
      .from('baileys_session')
      .select('id')
      .neq('id', 'creds')
      .lt('updated_at', hace60Dias)

    if (viejos && viejos.length > 0) {
      const ids = viejos.map((r) => r.id)
      await borrarDatos(ids)
      console.log(`🧹 Limpiados ${ids.length} registros viejos (+60d)`)
    }
  } catch (e) {
    console.error('🧹 Error en limpieza de sesión:', e)
  }
}

// Borra varios datos de sesión de un tirón de Supabase
async function borrarDatos(ids: string[]) {
  if (ids.length === 0) return

  const TAMANO_LOTE = 100
  for (let i = 0; i < ids.length; i += TAMANO_LOTE) {
    const lote = ids.slice(i, i + TAMANO_LOTE)
    const { error } = await supabase
      .from('baileys_session')
      .delete()
      .in('id', lote)

    if (error) {
      console.error('❌ Error borrando lote de baileys_session:', error.message)
    }
  }
}

// Reemplaza useMultiFileAuthState pero usando Supabase en lugar de disco
export async function useSupabaseAuthState() {
  // Intenta cargar las credenciales guardadas, si no existen las crea nuevas
  const datos = await leerDatos(['creds'])
  let creds: AuthenticationCreds =
    (datos['creds'] as AuthenticationCreds) ?? initAuthCreds()

  // Dispará limpieza de claves viejas sin bloquear la conexión
  limpiarSessionVieja()

  console.log(
    '🔑 Creds cargadas desde Supabase:',
    creds ? 'SÍ' : 'NO - creando nuevas',
  )

  return {
    state: {
      get creds() {
        return creds
      },
      keys: {
        get: async (type: keyof SignalDataTypeMap, ids: string[]) => {
          if (ids.length === 0) return {}

          // Batch: todos los ids en UNA consulta
          const claves = ids.map((id) => `${type}-${id}`)
          const datosPorClave = await leerDatos(claves)

          const resultado: Record<string, unknown> = {}
          for (const id of ids) {
            let valor = datosPorClave[`${type}-${id}`] ?? null
            // Las claves de pre-key necesitan deserialización especial
            if (type === 'app-state-sync-key' && valor) {
              valor = proto.Message.AppStateSyncKeyData.fromObject(valor)
            }
            resultado[id] = valor
          }
          return resultado
        },
        set: async (data: Record<string, Record<string, unknown>>) => {
          const upserts: Array<{ id: string; valor: unknown }> = []
          const deletes: string[] = []

          for (const [type, ids] of Object.entries(data)) {
            for (const [id, valor] of Object.entries(ids)) {
              if (valor) {
                upserts.push({ id: `${type}-${id}`, valor })
              } else {
                deletes.push(`${type}-${id}`)
              }
            }
          }

          await Promise.all([guardarDatos(upserts), borrarDatos(deletes)])
        },
      },
    },
    // Llama a esto cada vez que las credenciales cambian
    saveCreds: async () => {
      await guardarDatos([{ id: 'creds', valor: creds }])
    },
  }
}

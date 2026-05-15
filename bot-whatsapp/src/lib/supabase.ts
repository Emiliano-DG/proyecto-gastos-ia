import { createClient } from '@supabase/supabase-js'
import type { Transaccion } from '../types/transaccion.js'

const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_KEY ?? '',
)

export async function guardarTransaccion(
  transaccion: Transaccion,
  numeroWhatsapp: string,
): Promise<boolean> {
  const { error } = await supabase.from('transacciones').insert({
    monto: transaccion.monto,
    descripcion: transaccion.descripcion,
    categoria: transaccion.categoria,
    fecha: transaccion.fecha,
    tipo: transaccion.tipo,
    numero_whatsapp: numeroWhatsapp,
  })

  if (error) {
    console.error('❌ Error guardando en Supabase:', error.message)
    return false
  }

  console.log('✅ Transacción guardada en Supabase')
  return true
}

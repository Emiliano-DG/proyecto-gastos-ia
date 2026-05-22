import { supabase } from '@/lib/supabase'
import { Transaccion } from '@/types/transaccion'
import { useEffect, useState } from 'react'

export function useTransaccion() {
  const [transaccion, setTransaccion] = useState<Transaccion[]>([])
  const [cargando, setCargando] = useState(true)

  // 1. Estado para guardar el error
  const [error, setError] = useState<string | null>(null)

  const cargarDatos = async () => {
    setCargando(true)
    setError(null) // Limpiamos errores previos al volver a intentar

    const { data, error: supabaseError } = await supabase
      .from('transacciones')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (supabaseError) {
      console.error('Error al cargar transacciones:', supabaseError.message)
      // 2. Guardamos el mensaje de error
      setError('No pudimos cargar tus movimientos. Inténtalo de nuevo.')
    } else {
      setTransaccion(data ?? [])
    }
    setCargando(false)
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  // 3. Exportamos el error y la función para reintentar
  return { transaccion, cargando, error, refrescarTransaccion: cargarDatos }
}

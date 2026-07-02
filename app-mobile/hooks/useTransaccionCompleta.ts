import { supabase } from '@/lib/supabase'
import { Transaccion } from '@/types/transaccion'
import { useQuery } from '@tanstack/react-query'

async function fetchTransaccionesPorMes(
  mes: number,
  anio: number,
): Promise<Transaccion[]> {
  // Primer dia del mes
  const mesPad = String(mes + 1).padStart(2, '0')
  const primerDia = `${anio}-${mesPad}-01`

  // Primer día del mes siguiente
  const fechaFin = new Date(anio, mes + 1, 1)
  const ultimoDia = fechaFin.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('transacciones')
    .select('*')
    .gte('fecha', primerDia)
    .lt('fecha', ultimoDia)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export function useTransaccionCompleta(mes: number, anio: number) {
  return useQuery({
    queryKey: ['transacciones', mes, anio],
    queryFn: () => fetchTransaccionesPorMes(mes, anio),
  })
}

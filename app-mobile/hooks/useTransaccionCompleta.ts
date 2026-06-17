import { supabase } from '@/lib/supabase'
import { Transaccion } from '@/types/transaccion'
import { useQuery } from '@tanstack/react-query'

async function fetchTransaccionCompleta(): Promise<Transaccion[]> {
  const { data, error } = await supabase
    .from('transacciones')
    .select('*')
    .order('created_at', { ascending: false })
  // sin limit — trae todas las transacciones

  if (error) throw new Error(error.message)
  return data ?? []
}

export function useTransaccionCompleta() {
  return useQuery({
    queryKey: ['transacciones-completa'],
    queryFn: fetchTransaccionCompleta,
  })
}

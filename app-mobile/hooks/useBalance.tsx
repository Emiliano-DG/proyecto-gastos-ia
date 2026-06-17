import { supabase } from '@/lib/supabase'
import { calculateBalance } from '@/utils/finance'
import { useQuery } from '@tanstack/react-query'

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transacciones')
        .select('tipo, monto')
      // sin limit, trae solo dos columnas
      if (error) throw error
      return calculateBalance(data ?? [])
    },
    staleTime: 30_000, // opcional, para no pegarle cada 2 segundos
  })
}

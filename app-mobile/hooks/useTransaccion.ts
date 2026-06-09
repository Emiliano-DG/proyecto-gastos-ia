import { supabase } from "@/lib/supabase";
import { Transaccion } from "@/types/transaccion";
import { useQuery } from "@tanstack/react-query";

async function fetchTransaccion(): Promise<Transaccion[]> {
  const { data, error } = await supabase
    .from("transacciones")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export function useTransaccion() {
  return useQuery({
    queryKey: ["transacciones"],
    queryFn: fetchTransaccion,
  });
}

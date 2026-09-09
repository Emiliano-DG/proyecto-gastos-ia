import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CrearTransaccionParams {
  monto: number;
  categoria: string;
  fecha: string;
  descripcion: string;
  tipo: "ingreso" | "gasto";
  numero_whatsapp?: string;
}

export function useCrearTransaccion(mes: number, anio: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CrearTransaccionParams) => {
      const { error } = await supabase.from("transacciones").insert({
        monto: params.monto,
        categoria: params.categoria,
        fecha: params.fecha,
        descripcion: params.descripcion,
        tipo: params.tipo,
        numero_whatsapp: params.numero_whatsapp ?? "",
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transacciones", mes, anio],
      });
    },
  });
}

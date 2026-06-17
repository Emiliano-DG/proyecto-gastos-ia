import { Transaccion } from "@/types/transaccion";

type TransaccionBalance = Pick<Transaccion, "monto" | "tipo">;

// Calculo del balance para los gastos e ingresos generales
export const calculateBalance = (transaccion: TransaccionBalance[]) => {
  const ingresos = transaccion
    .filter((m) => m.tipo === "ingreso")
    .reduce((acc, m) => acc + m.monto, 0);

  const gastos = transaccion
    .filter((m) => m.tipo === "gasto")
    .reduce((acc, m) => acc + m.monto, 0);

  const TransaccionBalance = ingresos - gastos;
  return { TransaccionBalance, ingresos, gastos };
};

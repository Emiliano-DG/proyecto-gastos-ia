import { Transaccion } from '@/types/transaccion'

// Calculo del balance para los gastos e ingresos generales
export const calculateBalance = (transaccion: Transaccion[]) => {
  const ingresos = transaccion
    .filter((m) => m.tipo === 'ingreso')
    .reduce((acc, m) => acc + m.monto, 0)

  const gastos = transaccion
    .filter((m) => m.tipo === 'gasto')
    .reduce((acc, m) => acc + m.monto, 0)

  const TransaccionBalance = ingresos - gastos
  return { TransaccionBalance, ingresos, gastos }
}

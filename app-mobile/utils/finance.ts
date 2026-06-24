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

export function filtrarMes(
  transaccion: Transaccion[],
  fecha: Date,
): Transaccion[] {
  return transaccion?.filter((movement) => {
    // Parsear la fecha en formato YYYY-MM-DD de forma local (sin afectar zona horaria)
    const [year, month, day] = movement.fecha.split("-").map(Number);
    const movementDate = new Date(year, month - 1, day);
    return (
      movementDate.getMonth() === fecha.getMonth() &&
      movementDate.getFullYear() === fecha.getFullYear()
    );
  });
}

export function agruparPorCategoria(
  transaccion: Transaccion[],
  type: "gasto" | "ingreso" = "gasto",
): Record<string, number> {
  return transaccion
    .filter((m) => m.tipo === type)
    .reduce(
      (acc, current) => {
        const categoria = current.categoria || "Otros";
        if (!acc[categoria]) {
          acc[categoria] = 0;
        }
        acc[categoria] += current.monto;
        return acc;
      },
      // esto se hace para que TypeScript entienda que el acumulador es un objeto con claves de string y valores numéricos
      {} as Record<string, number>,
    );
}

export function calcularVariacion(
  totalActual: number,
  totalAnterior: number | undefined,
): number | null {
  if (!totalAnterior || totalAnterior === 0) return null; // Evitar división por cero o falta de datos
  return ((totalActual - totalAnterior) / totalAnterior) * 100;
}

//Graficos de torta para mostrar los gastos por categoría
export interface CategoriaChart {
  nombre: string;
  valor: number;
  color: string;
}

const COLORES_CATEGORIAS = [
  "#60a5fa", // azul
  "#f87171", // rojo
  "#fbbf24", // amarillo
  "#34d399", // verde
  "#a78bfa", // violeta (para "Otros")
];

export function prepararDatosChart(
  gastosPorCategoria: Record<string, number>,
  topN: number = 4,
): CategoriaChart[] {
  const entradas = Object.entries(gastosPorCategoria).sort(
    (a, b) => b[1] - a[1],
  );

  const top = entradas.slice(0, topN);
  const resto = entradas.slice(topN);

  const datos: CategoriaChart[] = top.map(([nombre, valor], i) => ({
    nombre,
    valor,
    color: COLORES_CATEGORIAS[i] ?? "#94a3b8",
  }));

  if (resto.length > 0) {
    const totalResto = resto.reduce((acc, [, valor]) => acc + valor, 0);
    datos.push({
      nombre: "Otros",
      valor: totalResto,
      color: COLORES_CATEGORIAS[4] ?? "#94a3b8",
    });
  }

  return datos;
}

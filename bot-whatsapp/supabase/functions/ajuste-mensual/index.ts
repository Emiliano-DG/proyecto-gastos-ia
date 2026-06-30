// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (_req) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 = enero

  // Mes anterior
  let prevMonth = currentMonth - 1;
  let prevYear = currentYear;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear = currentYear - 1;
  }

  // Primer día del mes anterior y del mes actual
  const prevStart = new Date(prevYear, prevMonth, 1)
    .toISOString()
    .split("T")[0];
  const currentStart = new Date(currentYear, currentMonth, 1)
    .toISOString()
    .split("T")[0];

  // ── Idempotencia: si ya hay ajuste este mes, salir ──
  const { data: existente } = await supabase
    .from("transacciones")
    .select("id")
    .eq("categoria", "ajuste")
    .gte("fecha", currentStart)
    .limit(1);

  if (existente && existente.length > 0) {
    return new Response(
      JSON.stringify({
        message: "Ya existe ajuste para este mes, se omite",
        ejecutado: false,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  // ── Calcular balance del mes anterior ──
  const { data: ingresos } = await supabase
    .from("transacciones")
    .select("monto")
    .eq("tipo", "ingreso")
    .gte("fecha", prevStart)
    .lt("fecha", currentStart);

  const { data: gastos } = await supabase
    .from("transacciones")
    .select("monto")
    .eq("tipo", "gasto")
    .gte("fecha", prevStart)
    .lt("fecha", currentStart);

  const totalIngresos = ingresos?.reduce((s, t) => s + t.monto, 0) ?? 0;
  const totalGastos = gastos?.reduce((s, t) => s + t.monto, 0) ?? 0;
  const balance = totalIngresos - totalGastos;

  if (balance === 0) {
    return new Response(
      JSON.stringify({
        message: "Balance cero, no se necesita ajuste",
        ejecutado: false,
        balance: 0,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  // ── Insertar ajuste ──
  const tipo = balance > 0 ? "ingreso" : "gasto";
  const montoAbs = Math.abs(balance);
  const mesTexto = `${prevMonth + 1}/${prevYear}`;
  const descripcion =
    balance > 0
      ? `Ajuste mensual: sobrante de ${mesTexto}`
      : `Ajuste mensual: faltante de ${mesTexto}`;

  const { error } = await supabase.from("transacciones").insert({
    monto: montoAbs,
    descripcion,
    categoria: "ajuste",
    fecha: currentStart,
    tipo,
    numero_whatsapp: "sistema",
  });

  if (error) {
    console.error("Error al insertar ajuste:", error);
    return new Response(
      JSON.stringify({
        error: "Error al insertar ajuste",
        detalle: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({
      message: `Ajuste creado: ${tipo === "ingreso" ? "sobrante" : "faltante"} de $${montoAbs.toLocaleString("es-AR")}`,
      ejecutado: true,
      balance,
      tipo,
      monto: montoAbs,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Transaccion } from '../types/transaccion.js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const PROMPT_SISTEMA = `
Eres un asistente que extrae información de gastos e ingresos de mensajes en lenguaje natural.
Dado un mensaje, respondé ÚNICAMENTE con un JSON con esta estructura, sin texto extra, sin markdown:
{
  "monto": número,
  "descripcion": "string",
  "categoria": "string",
  "fecha": "YYYY-MM-DD",
  "tipo": "gasto" | "ingreso"
}

Categorías posibles para gastos: comida, transporte, entretenimiento, salud, servicios, ropa, otros.
Categorías posibles para ingresos: sueldo, freelance, venta, otros.
Si no se menciona fecha, usá la de hoy.
Si no podés extraer un gasto o ingreso válido, respondé: {"error": "no_entendido"}
`

export async function procesarMensaje(
  texto: string,
  fechaHoy: string,
): Promise<Transaccion | null> {
  try {
    const prompt = `Fecha de hoy: ${fechaHoy}\nMensaje: "${texto}"`
    const result = await model.generateContent([PROMPT_SISTEMA, prompt])
    const respuesta = result.response.text().trim()

    const json = JSON.parse(respuesta) as Record<string, unknown>

    if ('error' in json) return null

    return {
      monto: json['monto'] as number,
      descripcion: json['descripcion'] as string,
      categoria: json['categoria'] as string,
      fecha: json['fecha'] as string,
      tipo: json['tipo'] as 'gasto' | 'ingreso',
    }
  } catch {
    return null
  }
}

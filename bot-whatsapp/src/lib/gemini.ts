import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Transaccion } from '../types/transaccion.js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

// Forzamos al modelo a devolver JSON estricto
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
  },
})

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

    const respuestaRaw = result.response.text()

    // Elimina ```json ... ``` o cualquier otro formato de bloque que el modelo pueda usar, y limpia espacios
    const respuestaLimpia = respuestaRaw
      .replace(/```/g, '')
      .replace(/\bjson\b/gi, '')
      .trim()

    //extrae el json real, “busca dentro del texto el bloque que parece { ... }”
    const jsonMatch = respuestaLimpia.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('⚠️ No se encontró JSON en la respuesta de Gemini')
      return null
    }

    // pasear el json a objeto
    const json = JSON.parse(jsonMatch[0]) as Record<string, unknown>
    if (json.error) {
      console.warn('⚠️ Gemini devolvió error:', json.error)
      return null
    }

    // Validar y transformar los datos extraídos
    const montoRaw = json['monto']
    const monto =
      typeof montoRaw === 'string'
        ? //si el monto viene con símbolos o texto, extrae solo la parte numérica, incluyendo decimales y negativos
          Number(String(montoRaw).replace(/[^0-9.-]+/g, ''))
        : Number(montoRaw)
    const descripcion = String(json['descripcion'] ?? '').trim()
    const categoria = String(json['categoria'] ?? 'otros')
      .trim()
      .toLowerCase()
    const fecha = String(json['fecha'] ?? fechaHoy).trim() || fechaHoy
    const tipo = String(json['tipo'] ?? '').trim() as 'gasto' | 'ingreso'

    if (
      !Number.isFinite(monto) ||
      !descripcion ||
      !categoria ||
      !fecha ||
      (tipo !== 'gasto' && tipo !== 'ingreso')
    ) {
      console.warn(
        '⚠️ Datos incompletos o inválidos en la respuesta de Gemini',
        {
          monto: montoRaw,
          descripcion,
          categoria,
          fecha,
          tipo,
        },
      )
      return null
    }

    return {
      monto,
      descripcion,
      categoria,
      fecha,
      tipo,
    }
  } catch (error) {
    console.error('❌ Error al procesar el mensaje con Gemini', error)
    return null
  }
}

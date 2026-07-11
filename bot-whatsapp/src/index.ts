import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import "dotenv/config"; // carga las variables de entorno del archivo .env
import { procesarMensaje } from "./lib/gemini.js"; // función que manda el texto a Gemini y devuelve la transacción
import { guardarTransaccion } from "./lib/supabase.js"; // función que guarda la transacción en la base de datos
import QRCode from "qrcode"; // convierte el QR de texto a imagen
import express from "express"; // librería para crear el servidor web
import { useSupabaseAuthState } from "./lib/supabaseAuthState.js";

// ─── SERVIDOR WEB PARA EL QR ─────────────────────────────────────────────────

// Crea el servidor web
const app = express();

// Variable que guarda la imagen del QR, empieza vacía
// Se llena cuando WhatsApp genera el QR y se limpia cuando el bot se conecta
let qrImageUrl = "";

// Cuando alguien entra a /qr en el navegador, muestra el QR o un mensaje de espera
app.get("/qr", async (req, res) => {
  if (qrImageUrl) {
    // Si hay QR disponible, muestra una página con la imagen para escanear
    res.send(`
      <html>
        <body style="background:#111;display:flex;justify-content:center;align-items:center;height:100vh">
          <img src="${qrImageUrl}" style="width:300px;height:300px"/>
        </body>
      </html>
    `);
  } else {
    // Si todavía no hay QR, muestra un mensaje para que el usuario espere y recargue
    res.send(
      '<html><body style="background:#111;color:white;display:flex;justify-content:center;align-items:center;height:100vh"><h2>QR no disponible, esperá unos segundos y recargá</h2></body></html>',
    );
  }
});

// Arranca el servidor web en el puerto 3000
// Railway convierte ese puerto en la URL pública del bot
app.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Servidor QR corriendo en puerto 3000");
});

// ─── BOT DE WHATSAPP ──────────────────────────────────────────────────────────

async function conectar() {
  // Carga la sesión guardada de WhatsApp desde la carpeta auth_info
  // Si no existe todavía, la crea nueva y genera el QR para escanear
  //const { state, saveCreds } = await useMultiFileAuthState('./auth_info')

  const { state, saveCreds } = await useSupabaseAuthState();

  // Obtiene la última versión disponible de WhatsApp para conectarse
  const { version } = await fetchLatestBaileysVersion();

  // Guarda el momento exacto en que arrancó el bot en segundos
  // Se usa para ignorar mensajes anteriores a este momento
  const arranque = Math.floor(Date.now() / 1000);

  // Crea el cliente de WhatsApp con la sesión y la versión
  const sock = makeWASocket({
    version,
    auth: state as any, // el tipo de auth no coincide exactamente, pero funciona igual
  });

  // Cada vez que la sesión cambia (por ejemplo al escanear el QR),
  // la guarda en la carpeta auth_info para no perderla
  sock.ev.on("creds.update", saveCreds);

  // Escucha los cambios en la conexión (si se cae, si se conecta, si genera QR)
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      // Cuando WhatsApp genera un QR, lo convierte a imagen y lo guarda
      // para que Express lo pueda mostrar en el navegador
      qrImageUrl = await QRCode.toDataURL(qr);
      console.log("📱 QR listo, abrí /qr en el navegador para escanearlo");
    }

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("❌ Conexión cerrada, reconectando en 5s...");
        setTimeout(() => conectar(), 5000);
      } else {
        console.log("🚪 Sesión cerrada manualmente, no reconecta");
      }
    } else if (connection === "open") {
      qrImageUrl = "";
      console.log("✅ Bot de Gastos listo y conectado");
    }
  });
  // Escucha los mensajes nuevos que llegan
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]; // toma el primer mensaje del lote

    // Si no hay mensaje, no hace nada
    if (!msg) return;

    // Ignora los mensajes que mandó el bot mismo (sus propias respuestas)
    // para evitar que el bot se lea a sí mismo y entre en un loop
    if (msg.key.fromMe) return;

    // Ignora mensajes que llegaron antes de que arrancara el bot
    // para no reprocesar mensajes viejos al reconectar
    const timestampMsg = Number(msg.messageTimestamp);
    if (timestampMsg < arranque) return;

    // Extrae el texto del mensaje
    // WhatsApp guarda el texto en lugares distintos según el tipo de mensaje:
    // conversation: mensaje de texto simple
    // extendedTextMessage: mensaje con preview de link u otros
    // si no encuentra ninguno, usa string vacío
    const texto =
      msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? "";

    // Si el mensaje no tiene texto (por ejemplo una foto sin caption), no hace nada
    if (!texto) return;

    console.log(`📩 Mensaje recibido: "${texto}"`);

    // Obtiene la fecha de hoy en formato YYYY-MM-DD para pasarle a Gemini
    const fechaHoy = new Date().toISOString().split("T")[0] ?? "";

    // Manda el texto a Gemini para que extraiga la transacción
    // Si el mensaje no tiene sentido financiero, devuelve null
    const transaccion = await procesarMensaje(texto, fechaHoy);

    // jid es el identificador del chat al que hay que responder
    const jid = msg.key.remoteJid!;

    if (transaccion) {
      // Si Gemini entendió la transacción, la guarda en Supabase
      const guardado = await guardarTransaccion(transaccion, jid);
      const emoji = transaccion.tipo === "gasto" ? "💸" : "💰";

      const tipoTexto =
        transaccion.tipo === "ingreso" ? "🟢 Ingreso" : "🔴 Gasto";

      if (guardado) {
        // Formato profesional de moneda
        const montoFormateado = new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(transaccion.monto);

        // Mensaje de éxito: Estético, limpio y minimalista
        await sock.sendMessage(jid, {
          text:
            `${emoji} *¡Movimiento Registrado!*\n\n` +
            `• *Tipo:* ${tipoTexto}\n` +
            `• *Monto:* ${montoFormateado}\n` +
            `• *Descripción:* ${transaccion.descripcion}\n` +
            `• *Categoría:* ${transaccion.categoria}\n` +
            `• *Fecha:* ${transaccion.fecha}\n\n` +
            `_Tu balance ha sido actualizado automáticamente._`, // <-- Cierre de valor para el usuario
        });
      } else {
        // Error al guardar (Falla técnica interna)
        await sock.sendMessage(jid, {
          text: "⚠️ *Servicio temporalmente no disponible.*\nEstamos experimentando intermitencias al guardar tus datos. Por favor, reintentá en unos segundos.",
        });
      }
    } else {
      // Si Gemini no entendió el mensaje, pide que lo reformulen
      await sock.sendMessage(jid, {
        text: '❓ No entendí el gasto. Probá con algo como: "gasté $500 en pizza" o "cobré $50000 de sueldo"',
      });
    }
  });
}

// Arranca el bot
conectar();

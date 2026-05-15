import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import type { Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import "dotenv/config";
import { procesarMensaje } from "./lib/gemini.js";
import { guardarTransaccion } from "./lib/supabase.js";

// Inicializamos el cliente de WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(), // Esto evita tener que escanear el QR cada vez
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// Generar el QR en la terminal
client.on("qr", (qr: string) => {
  console.log(" 📱 Escaneá este QR con tu WhatsApp:");
  qrcode.generate(qr, { small: true });
});

// Confirmación de conexión
client.on("ready", () => {
  console.log("✅ Bot de Gastos listo y conectado");
});

// Escuchar mensajes
client.on("message", async (msg: Message) => {
  console.log(`📩 Mensaje recibido: "${msg.body}"`);

  const fechaHoy = new Date().toISOString().split("T")[0] ?? ""; // YYYY-MM-DD
  const transaccion = await procesarMensaje(msg.body, fechaHoy);

  if (transaccion) {
    const guardado = await guardarTransaccion(transaccion, msg.from);
    const emoji = transaccion.tipo === "gasto" ? "💸" : "💰";

    if (guardado) {
      await msg.reply(
        `${emoji} Registrado!\n` +
          `💵  ${transaccion.monto}\n` +
          `📝  ${transaccion.descripcion}\n` +
          `🏷️ ${transaccion.categoria}\n` +
          `📅 ${transaccion.fecha}`,
      );
    } else {
      await msg.reply(
        "⚠️ Entendí el gasto pero hubo un error al guardarlo. Intentá de nuevo.",
      );
    }
  } else {
    await msg.reply(
      '❓ No entendí el gasto. Probá con algo como: "gasté $500 en pizza" o "cobré $50000 de sueldo"',
    );
  }
});

client.initialize();

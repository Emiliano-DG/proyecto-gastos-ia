import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import "dotenv/config";
import { procesarMensaje } from "./lib/gemini.js";
import { guardarTransaccion } from "./lib/supabase.js";
import QRCode from "qrcode";
import express from "express";

// Servidor web para mostrar el QR como imagen en el navegador
const app = express();
let qrImageUrl = "";

app.get("/qr", async (req, res) => {
  if (qrImageUrl) {
    res.send(`
      <html>
        <body style="background:#111;display:flex;justify-content:center;align-items:center;height:100vh">
          <img src="${qrImageUrl}" style="width:300px;height:300px"/>
        </body>
      </html>
    `);
  } else {
    res.send(
      '<html><body style="background:#111;color:white;display:flex;justify-content:center;align-items:center;height:100vh"><h2>QR no disponible, esperá unos segundos y recargá</h2></body></html>',
    );
  }
});

app.listen(3000, () => {
  console.log("🌐 Servidor QR corriendo en puerto 3000");
});

async function conectar() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
  const { version } = await fetchLatestBaileysVersion();
  const arranque = Math.floor(Date.now() / 1000);

  const sock = makeWASocket({
    version,
    auth: state,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      // Convierte el QR a imagen y lo guarda para mostrarlo en el navegador
      qrImageUrl = await QRCode.toDataURL(qr);
      console.log("📱 QR listo, abrí /qr en el navegador para escanearlo");
    }

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log("❌ Conexión cerrada, reconectando:", shouldReconnect);
      if (shouldReconnect) {
        conectar();
      }
    } else if (connection === "open") {
      qrImageUrl = ""; // limpia el QR cuando ya está conectado
      console.log("✅ Bot de Gastos listo y conectado");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg) return;
    if (msg.key.fromMe) return;
    const timestampMsg = Number(msg.messageTimestamp);
    if (timestampMsg < arranque) return;

    const texto =
      msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? "";

    if (!texto) return;

    console.log(`📩 Mensaje recibido: "${texto}"`);

    const fechaHoy = new Date().toISOString().split("T")[0] ?? "";
    const transaccion = await procesarMensaje(texto, fechaHoy);
    const jid = msg.key.remoteJid!;

    if (transaccion) {
      const guardado = await guardarTransaccion(transaccion, jid);
      const emoji = transaccion.tipo === "gasto" ? "💸" : "💰";

      if (guardado) {
        await sock.sendMessage(jid, {
          text:
            `${emoji} Registrado!\n` +
            `💵  ${transaccion.monto}\n` +
            `📝  ${transaccion.descripcion}\n` +
            `🏷️ ${transaccion.categoria}\n` +
            `📅 ${transaccion.fecha}`,
        });
      } else {
        await sock.sendMessage(jid, {
          text: "⚠️ Entendí el gasto pero hubo un error al guardarlo. Intentá de nuevo.",
        });
      }
    } else {
      await sock.sendMessage(jid, {
        text: '❓ No entendí el gasto. Probá con algo como: "gasté $500 en pizza" o "cobré $50000 de sueldo"',
      });
    }
  });
}

conectar();

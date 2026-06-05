import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import 'dotenv/config'
import { procesarMensaje } from './lib/gemini.js'
import { guardarTransaccion } from './lib/supabase.js'
import qrcode from 'qrcode-terminal'

async function conectar() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
  const { version } = await fetchLatestBaileysVersion()

  // Guarda el momento exacto en que arrancó el bot
  // para ignorar mensajes anteriores a este momento
  const arranque = Math.floor(Date.now() / 1000)

  const sock = makeWASocket({
    version,
    auth: state,
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut
      console.log('❌ Conexión cerrada, reconectando:', shouldReconnect)
      if (shouldReconnect) {
        conectar()
      }
    } else if (connection === 'open') {
      console.log('✅ Bot de Gastos listo y conectado')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]

    if (!msg) return

    // Ignora mensajes enviados por el bot mismo (sus propias respuestas)
    if (msg.key.fromMe) return

    // Ignora mensajes que llegaron antes de que arrancara el bot
    const timestampMsg = Number(msg.messageTimestamp)
    if (timestampMsg < arranque) return

    const texto =
      msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? ''

    if (!texto) return

    console.log(`📩 Mensaje recibido: "${texto}"`)

    const fechaHoy = new Date().toISOString().split('T')[0] ?? ''
    const transaccion = await procesarMensaje(texto, fechaHoy)
    const jid = msg.key.remoteJid!

    if (transaccion) {
      const guardado = await guardarTransaccion(transaccion, jid)
      const emoji = transaccion.tipo === 'gasto' ? '💸' : '💰'

      if (guardado) {
        await sock.sendMessage(jid, {
          text:
            `${emoji} Registrado!\n` +
            `💵  ${transaccion.monto}\n` +
            `📝  ${transaccion.descripcion}\n` +
            `🏷️ ${transaccion.categoria}\n` +
            `📅 ${transaccion.fecha}`,
        })
      } else {
        await sock.sendMessage(jid, {
          text: '⚠️ Entendí el gasto pero hubo un error al guardarlo. Intentá de nuevo.',
        })
      }
    } else {
      await sock.sendMessage(jid, {
        text: '❓ No entendí el gasto. Probá con algo como: "gasté $500 en pizza" o "cobré $50000 de sueldo"',
      })
    }
  })
}

conectar()

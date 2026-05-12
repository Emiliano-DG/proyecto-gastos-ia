import pkg from 'whatsapp-web.js'
const { Client, LocalAuth } = pkg
import type { Message } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import 'dotenv/config'

// Inicializamos el cliente de WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(), // Esto evita tener que escanear el QR cada vez
  puppeteer: {
    args: ['--no-sandbox'],
  },
})

// Generar el QR en la terminal
client.on('qr', (qr: string) => {
  console.log(' 📱 Escaneá este QR con tu WhatsApp:')
  qrcode.generate(qr, { small: true })
})

// Confirmación de conexión
client.on('ready', () => {
  console.log('¡Bot de Gastos listo y conectado!')
})

// Escuchar mensajes
client.on('message', async (msg: Message) => {
  // Por ahora, solo responde un "recibido" para probar
  if (msg.body.toLowerCase().includes('hola')) {
    msg.reply(
      '¡Hola Emiliano! Soy tu asistente de finanzas. Mandame un gasto (ej: "1500 en pizza") y yo lo anoto.',
    )
  }
})

client.initialize()

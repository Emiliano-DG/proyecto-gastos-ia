<div align="center">

# 💰 Smart Finance Tracker

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Gemini-8E75FF?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Tailwind CSS](https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)

**Controlá tus gastos sin esfuerzo — mandá un mensaje por WhatsApp y listo.**

Mandá *"gasté $500 en pizza"* a tu bot, y la IA lo categoriza y lo guarda automáticamente. Después visualizá todo en una app mobile hermosa.

</div>

---

## ✨ Funcionalidades

### 🤖 Bot de WhatsApp
- **Lenguaje natural** — Mandá mensajes como *"gasté $500 en pizza"* o *"cobré $50.000 de sueldo"*. Funciona con **Google Gemini AI**.
- **Categorización automática** — Comida, transporte, salud, entretenimiento, sueldo, freelance, tarjeta de crédito y más.
- **Confirmación instantánea** — Recibí un comprobante limpio y formateado de vuelta en WhatsApp.
- **Ajuste mensual automático** — Una Edge Function de Supabase reconcilia sobrantes o faltantes cada mes.
- **Sesión persistente** — El estado de autenticación se guarda en Supabase, no necesitas escanear el QR cada vez.

### 📱 App Mobile (React Native + Expo)
- **Panel principal** — Balance disponible, ingresos y gastos de un vistazo.
- **Feed de transacciones** — Lista scrolleable con íconos, categorías y montos con código de colores.
- **Reportes interactivos** — Navegá por mes, gráficos de torta, comparativa de ingresos vs gastos.
- **Desglose por categoría** — Tocá cualquier categoría para ver el detalle.
- **Modo oscuro** — Tema elegante claro/oscuro inspirado en el diseño de Apple.
- **Rendimiento nativo** — Expo SDK 54, Reanimated y Gesture Handler.

### 🛡️ Backend (Supabase)
- **Base de datos PostgreSQL** — Esquema estructurado para transacciones con integración de WhatsApp.
- **Edge Functions** — Lógica serverless de ajuste mensual corriendo en Deno.
- **Real-time listo** — Supabase Realtime configurado para actualizaciones en vivo.

---

## 🏗️ Arquitectura

```
                    ┌──────────────────────┐
                    │   Usuario WhatsApp    │
                    └──────┬───────────────┘
                           │ "gasté $500 en pizza"
                           ▼
┌─────────────────────────────────────────────────┐
│            Bot de WhatsApp (TypeScript)           │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │  Baileys  │───▶│  Gemini  │───▶│ Supabase │   │
│  │ (Web API) │    │   AI     │    │  Client  │   │
│  └──────────┘    └──────────┘    └──────────┘   │
│         │                                        │
│    Express Server (para mostrar QR)              │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│               Supabase (PostgreSQL)              │
│  ┌────────────────┐  ┌────────────────────────┐  │
│  │  transacciones  │  │  Edge Functions        │  │
│  │     (tabla)     │  │  (Ajuste Mensual)      │  │
│  └────────────────┘  └────────────────────────┘  │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│         App Mobile (React Native + Expo)          │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │  Expo    │  │ TanStack │  │   NativeWind   │ │
│  │  Router  │  │ Query    │  │  (Tailwind)    │ │
│  └──────────┘  └──────────┘  └────────────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │  Zustand │  │ Gifted   │  │  Tema           │ │
│  │          │  │ Charts   │  │  Claro/Oscuro   │ │
│  └──────────┘  └──────────┘  └────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologías

### Bot de WhatsApp
| Tecnología | Propósito |
|---|---|
| **TypeScript** | Código tipado y seguro |
| **Baileys** | API no oficial de WhatsApp Web (sin navegador) |
| **Google Gemini 2.5 Flash** | Lenguaje natural → transacción estructurada |
| **Express** | Servidor web para el QR de autenticación |
| **Supabase JS** | Cliente de base de datos |
| **QRCode** | Generación de QR para vincular WhatsApp |

### App Mobile
| Tecnología | Propósito |
|---|---|
| **React Native 0.81** | Framework mobile cross-platform |
| **Expo SDK 54** | Runtime administrado y build pipeline |
| **Expo Router** | Navegación basada en archivos |
| **NativeWind 4** | Tailwind CSS para React Native |
| **TanStack React Query 5** | Estado del servidor y caché |
| **Zustand** | Estado global liviano |
| **react-native-gifted-charts** | Gráficos de torta interactivos |
| **react-native-reanimated** | Animaciones suaves |
| **Supabase JS** | Cliente de base de datos |

### Backend
| Tecnología | Propósito |
|---|---|
| **Supabase** | Base de datos PostgreSQL + auth + edge functions |
| **Deno** | Runtime para las Edge Functions de Supabase |
| **Supabase Realtime** | Sincronización de datos en vivo |

---

## 📸 Capturas de pantalla

*(Agregar screenshots — pantalla principal, reportes con gráfico de torta, conversación de WhatsApp)*

> **Tip:** Sacale capturas en modo claro y oscuro para mostrar el theme.

---

## 🚀 Cómo empezar

### Requisitos
- Node.js 18+
- Un proyecto en Supabase
- Una API key de Google Gemini
- Expo Go (para probar la app mobile)

### 1. Clonar el repositorio
```bash
git clone https://github.com/Emiliano-DG/proyecto-gastos-ia.git
cd proyecto-gastos-ia
```

### 2. Configurar el Bot de WhatsApp
```bash
cd bot-whatsapp
npm install
cp .env.example .env
```

Completá tu `.env`:
```env
GEMINI_API_KEY=tu_api_key_de_gemini
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
PORT=3000
```

Ejecutar el bot:
```bash
npm run dev
```

Abrí `http://localhost:3000/qr` en el navegador, escaneá el QR con WhatsApp y ya está conectado.

### 3. Configurar la App Mobile
```bash
cd app-mobile
npm install
cp .env.example .env
```

Completá tu `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=tu_anon_key
```

Iniciar la app:
```bash
npx expo start
```

### 4. Base de datos
Crear la tabla `transacciones` en Supabase con este esquema:

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` (PK, default `gen_random_uuid()`) | ID único |
| `monto` | `numeric` | Monto de la transacción |
| `descripcion` | `text` | Descripción |
| `categoria` | `text` | Categoría |
| `fecha` | `date` | Fecha de la transacción |
| `tipo` | `text` | `ingreso` o `gasto` |
| `numero_whatsapp` | `text` | ID de WhatsApp del remitente |
| `created_at` | `timestamptz` (default `now()`) | Fecha de creación |

Habilitar Row Level Security (RLS) con una policy que permita las operaciones según lo que necesites.

---

## 📱 Uso

### Comandos de WhatsApp
```
💸 "gasté $500 en pizza"           → Gasto: comida
💰 "cobré $50.000 de sueldo"       → Ingreso: sueldo
💳 "pagué $12.000 de tarjeta"      → Gasto: credito
🚗 "pague $800 de seguro moto"     → Gasto: transporte
📊 "gasté $200 en el cine"         → Gasto: entretenimiento
🏥 "pague $3000 en farmacia"       → Gasto: salud
```

### Categorías
| Ingresos | Gastos |
|---|---|
| sueldo, freelance, venta, otros | comida, transporte, entretenimiento, salud, servicios, ropa, credito, otros |

---

## 🗺️ Próximos pasos

- [ ] **Soporte multi-usuario** — Finanzas personales por número de WhatsApp
- [ ] **Metas de presupuesto** — Límites mensuales por categoría
- [ ] **Transacciones recurrentes** — Detectar patrones automáticamente
- [ ] **Exportar a CSV/PDF** — Compartir reportes
- [ ] **Notificaciones push** — Resumen diario de gastos
- [ ] **Versión web** — Dashboard complementario

---

## 🧑‍💻 Desarrollo

```bash
# Bot — modo desarrollo con hot reload
cd bot-whatsapp && npm run dev

# Mobile — servidor de desarrollo Expo
cd app-mobile && npx expo start

# Edge functions (Supabase local)
cd bot-whatsapp && npx supabase functions serve
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Abrí issues o mandá PRs.

1. Forkeá el repositorio
2. Creá tu rama (`git checkout -b feat/mi-feature`)
3. Commiteá tus cambios (`git commit -m 'feat: agrego mi feature'`)
4. Pusheá la rama (`git push origin feat/mi-feature`)
5. Abrí un Pull Request

---

## 📄 Licencia

MIT

---

<div align="center">
  <p>
    Hecho con ❤️ usando <strong>React Native</strong>, <strong>TypeScript</strong> y <strong>Supabase</strong>
  </p>
  <p>
    <sub>Control de gastos con IA — porque acordarte de dónde se fue la plata no debería ser un trabajo de tiempo completo.</sub>
  </p>
</div>

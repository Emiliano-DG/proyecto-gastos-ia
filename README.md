# 💰 Smart Finance Tracker

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Gemini-8E75FF?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Tailwind CSS](https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)

**Track your expenses effortlessly — just send a WhatsApp message.**

Send *"gasté $500 en pizza"* to your bot, and AI automatically categorizes and stores it. Then visualize everything in a beautiful mobile app.

</div>

---

## ✨ Features

### 🤖 WhatsApp Bot
- **Natural Language Parsing** — Send messages like *"gasté $500 en pizza"* or *"cobré $50.000 de sueldo"*. Powered by **Google Gemini AI**.
- **Automatic Categorization** — Food, transport, health, entertainment, salary, freelance, credit card payments, and more.
- **Instant Confirmation** — Get a clean, formatted receipt back in WhatsApp.
- **Monthly Balance Adjustment** — Supabase Edge Function automatically reconciles monthly surpluses/shortfalls.
- **Persistent Session** — Auth state stored in Supabase; survives restarts without re-scanning QR.

### 📱 Mobile App (React Native + Expo)
- **Dashboard** — View real-time balance, income, and expenses at a glance.
- **Transaction Feed** — Scrollable list with icons, categories, and color-coded amounts.
- **Interactive Reports** — Navigate by month, visual breakdown via **pie charts**, income vs. expense comparison.
- **Category Breakdown** — Tap any category to drill into details.
- **Dark Mode** — Elegant light/dark theme inspired by Apple design language.
- **Native Performance** — Built with Expo SDK 54, Reanimated, and Gesture Handler.

### 🛡️ Backend (Supabase)
- **PostgreSQL Database** — Structured schema for transactions with WhatsApp integration.
- **Edge Functions** — Serverless monthly adjustment logic running on Deno.
- **Real-time Ready** — Supabase Realtime configured for live updates.

---

## 🏗️ Architecture

```
                    ┌──────────────────────┐
                    │     WhatsApp User     │
                    └──────┬───────────────┘
                           │ "gasté $500 en pizza"
                           ▼
┌─────────────────────────────────────────────────┐
│           WhatsApp Bot (TypeScript)              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │  Baileys  │───▶│  Gemini  │───▶│ Supabase │   │
│  │ (Web API) │    │   AI     │    │  Client  │   │
│  └──────────┘    └──────────┘    └──────────┘   │
│         │                                        │
│    Express Server (QR display)                   │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│               Supabase (PostgreSQL)              │
│  ┌────────────────┐  ┌────────────────────────┐  │
│  │  transacciones  │  │  Edge Functions        │  │
│  │     table       │  │  (Monthly Adjustment)  │  │
│  └────────────────┘  └────────────────────────┘  │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│         Mobile App (React Native + Expo)         │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │  Expo    │  │ TanStack │  │   NativeWind   │ │
│  │  Router  │  │ Query    │  │  (Tailwind)    │ │
│  └──────────┘  └──────────┘  └────────────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │  Zustand │  │ Gifted   │  │   Dark/Light   │ │
│  │          │  │ Charts   │  │   Theme        │ │
│  └──────────┘  └──────────┘  └────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### WhatsApp Bot
| Technology | Purpose |
|---|---|
| **TypeScript** | Type-safe development |
| **Baileys** | WhatsApp Web API (unofficial, no browser needed) |
| **Google Gemini 2.5 Flash** | Natural language → structured transaction data |
| **Express** | Web server for QR authentication |
| **Supabase JS** | Database client |
| **QRCode** | QR generation for WhatsApp pairing |

### Mobile App
| Technology | Purpose |
|---|---|
| **React Native 0.81** | Cross-platform mobile framework |
| **Expo SDK 54** | Managed runtime & build pipeline |
| **Expo Router** | File-based navigation |
| **NativeWind 4** | Tailwind CSS for React Native |
| **TanStack React Query 5** | Server state & caching |
| **Zustand** | Lightweight client state |
| **react-native-gifted-charts** | Interactive pie charts |
| **react-native-reanimated** | Smooth animations |
| **Supabase JS** | Database client |

### Backend
| Technology | Purpose |
|---|---|
| **Supabase** | PostgreSQL database + auth + edge functions |
| **Deno** | Runtime for Supabase Edge Functions |
| **Supabase Realtime** | Live data sync (configured) |

---

## 📸 Screenshots

*(Add screenshots here — home screen, reports with pie chart, WhatsApp conversation)*

> **Tip:** Take screenshots of the app in both light and dark mode to showcase the theme system.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- A Google Gemini API key
- Expo Go (for mobile testing)

### 1. Clone the repository
```bash
git clone https://github.com/Emiliano-DG/bot-gastos-ia.git
cd smart-finance-tracker
```

### 2. WhatsApp Bot Setup
```bash
cd bot-whatsapp
npm install
cp .env.example .env
```

Fill in your `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3000
```

Run the bot:
```bash
npm run dev
```

Open `http://localhost:3000/qr` in your browser, scan the QR with WhatsApp, and you're connected.

### 3. Mobile App Setup
```bash
cd app-mobile
npm install
cp .env.example .env
```

Fill in your `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

Start the app:
```bash
npx expo start
```

### 4. Database Setup
Create a `transacciones` table in Supabase with the following schema:

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK, default `gen_random_uuid()`) | Primary key |
| `monto` | `numeric` | Transaction amount |
| `descripcion` | `text` | Description |
| `categoria` | `text` | Category |
| `fecha` | `date` | Transaction date |
| `tipo` | `text` | `ingreso` or `gasto` |
| `numero_whatsapp` | `text` | WhatsApp sender ID |
| `created_at` | `timestamptz` (default `now()`) | Creation timestamp |

Enable Row Level Security (RLS) with a policy that allows all operations for authenticated/anonymous users based on your needs.

---

## 📱 Usage

### WhatsApp Commands
```
💸 "gasté $500 en pizza"           → Expense: comida
💰 "cobré $50.000 de sueldo"       → Income: sueldo
💳 "pagué $12.000 de tarjeta"      → Expense: credito
🚗 "pague $800 de seguro moto"     → Expense: transporte
📊 "gasté $200 en el cine"         → Expense: entretenimiento
🏥 "pague $3000 en farmacia"       → Expense: salud
```

### Categories
| Ingresos | Gastos |
|---|---|
| sueldo, freelance, venta, otros | comida, transporte, entretenimiento, salud, servicios, ropa, credito, otros |

---

## 🗺️ Roadmap

- [ ] **Multi-user support** — Personal finances per WhatsApp number
- [ ] **Budget goals** — Set monthly limits per category
- [ ] **Recurring transactions** — Auto-detect patterns
- [ ] **Export to CSV/PDF** — Share reports
- [ ] **Push notifications** — Daily spending summaries
- [ ] **Web version** — Companion dashboard

---

## 🧑‍💻 Development

```bash
# Bot — development mode with hot reload
cd bot-whatsapp && npm run dev

# Mobile — Expo dev server
cd app-mobile && npx expo start

# Edge functions (local Supabase)
cd bot-whatsapp && npx supabase functions serve
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>
    Built with ❤️ using <strong>React Native</strong>, <strong>TypeScript</strong>, and <strong>Supabase</strong>
  </p>
  <p>
    <sub>AI-powered expense tracking — because remembering where your money went shouldn't be a full-time job.</sub>
  </p>
</div>

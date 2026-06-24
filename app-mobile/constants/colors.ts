// const tintColorLight = "#1D9BF0"; // El azul clásico y limpio de Twitter
//
// const tintColorDark = "#007BA7"; // El mismo azul, resalta perfecto sobre negro
//
// export const Colors = {
//   light: {
//     background: "#FFFFFF", // Blanco puro, máxima limpieza
//     surface: "#FFFFFF",
//     card: "#F7F9F9", // El gris ultra claro que usa Twitter para los bloques/cards
//
//     primary: "#1D9BF0", // Azul Twitter
//     secondary: "#0F1419", // Negro para botones secundarios o estados fuertes
//     tabBar: "#FFFFFF", // Barra blanca limpia
//
//     tint: tintColorLight,
//     tabIconDefault: "#536471", // Gris de los iconos nativos de Twitter
//     tabIconSelected: tintColorLight,
//
//     text: "#0F1419", // El negro tipográfico de Twitter (no es 100% negro, es más suave)
//     textSecondary: "#536471", // Gris para fechas, subtítulos y datos secundarios
//
//     border: "#EFF3F4", // Líneas divisorias súper finas y sutiles de Twitter
//
//     // Colores financieros adaptados al minimalismo (menos saturados)
//     income: "#00BA7C", // Un verde limpio y moderno
//     expense: "#F4212E", // El rojo exacto de los "likes" o alertas de Twitter
//
//     buttonText: "#FFFFFF",
//     icon: "#0F1419",
//   },
//
//   dark: {
//     background: "#000000", // Negro absoluto (Modo "Noche oscura" de Twitter, ahorra batería)
//     surface: "#16181C", // El gris oscuro exacto de las tarjetas y buscador de Twitter
//     card: "#16181C",
//
//     primary: "#007BA7",
//     secondary: "#F7F9F9", // Blanco/Gris claro para contrastes secundarios
//     tabBar: "#000000", // Barra negra que se funde con el fondo
//
//     tint: tintColorDark,
//     tabIconDefault: "#71767B", // Gris para iconos inactivos en modo oscuro
//     tabIconSelected: tintColorDark,
//
//     text: "#E7E9EA", // Blanco suave para que no canse la vista
//     textSecondary: "#71767B", // Gris apagado para jerarquía de texto
//
//     border: "#2F3336", // El borde sutil característico del modo oscuro de Twitter
//
//     income: "#00BA7C", // Mismo verde (contrasta perfecto sobre negro)
//     expense: "#F4212E", // Mismo rojo
//
//     buttonText: "#000000", // Texto negro sobre botones blancos/azules
//     icon: "#E7E9EA",
//   },
// };
//
const tintColorLight = "#111111";
const tintColorDark = "#FFFFFF";

export const Colors = {
  light: {
    // Fondo general
    background: "#F5F5F7",
    surface: "#FFFFFF",
    card: "#FFFFFF",

    // Colores principales
    primary: "#111111",
    secondary: "#6E6E73",

    // Tab bar
    tabBar: "#FFFFFF",

    tint: tintColorLight,
    tabIconDefault: "#8E8E93",
    tabIconSelected: "#111111",

    // Texto
    text: "#111111",
    textSecondary: "#8E8E93",

    // Bordes
    border: "#E5E5EA",

    // Finanzas
    income: "#34C759",
    expense: "#FF3B30",

    buttonText: "#FFFFFF",
    icon: "#111111",
  },

  dark: {
    // Fondo elegante (no negro puro)
    background: "#0F0F10",
    surface: "#1A1A1C",
    card: "#1A1A1C",

    // Colores principales
    primary: "#FFFFFF",
    secondary: "#A1A1AA",

    tabBar: "#151517",

    tint: tintColorDark,
    tabIconDefault: "#71717A",
    tabIconSelected: "#FFFFFF",

    // Texto
    text: "#FAFAFA",
    textSecondary: "#A1A1AA",

    // Bordes
    border: "#27272A",

    // Finanzas
    income: "#4ADE80",
    expense: "#F87171",

    buttonText: "#111111",
    icon: "#FAFAFA",
  },
};

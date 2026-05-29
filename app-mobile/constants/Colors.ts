const tintColorLight = '#FD7B41' // El salmón/naranja del card de balance
const tintColorDark = '#EDBF9B' // Una versión más suave para el modo oscuro

export const Colors = {
  light: {
    background: '#FFF9EF', // Fondo crema/hueso de la imagen
    surface: '#FFFFFF',
    card: '#FFFFFF',

    primary: '#FD7B41', // Salmón principal (Balance Card)
    secondary: '#C9A86A', // Dorado (Adobe Card)
    tabBar: '#0F172A', // El azul casi negro de la Tab Bar de la imagen

    tint: tintColorLight,
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#FFFFFF', // Icono activo en la barra negra

    text: '#0F172A', // Texto azul muy oscuro (Pizarra)
    textSecondary: '#64748B',

    border: '#EFE2C8', // Bordes suaves color arena

    income: '#22C55E',
    expense: '#FD7B41',

    buttonText: '#FFFFFF',
    icon: '#0F172A',
  },

  dark: {
    background: '#0F172A', // Azul pizarra profundo (el color de la Tab Bar)
    surface: '#1E293B',
    card: '#1E293B',

    primary: '#FD7B41', // Mantenemos el salmón como acento
    secondary: '#C9A86A',
    tabBar: '#1E293B', // Un poco más claro que el fondo

    tint: tintColorDark,
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,

    text: '#FFF9EF', // Texto crema (el fondo del modo light)
    textSecondary: '#EDBF9B',

    border: '#334155',

    income: '#34D399',
    expense: '#F87171',

    buttonText: '#FFFFFF',
    icon: '#FFF9EF',
  },
}

import Ionicons from '@expo/vector-icons/Ionicons'

export const CATEGORIAS: Record<
  string,
  {
    icon: keyof typeof Ionicons.glyphMap
    color: string
  }
> = {
  comida: {
    icon: 'restaurant-outline',
    color: '#F97316', // naranja
  },

  transporte: {
    icon: 'car-outline',
    color: '#3B82F6', // azul
  },

  entretenimiento: {
    icon: 'film-outline',
    color: '#A855F7', // violeta
  },

  salud: {
    icon: 'medical-outline',
    color: '#EF4444', // rojo
  },

  servicios: {
    icon: 'flash-outline',
    color: '#EAB308', // amarillo
  },

  ropa: {
    icon: 'shirt-outline',
    color: '#EC4899', // rosa
  },

  sueldo: {
    icon: 'briefcase-outline',
    color: '#22C55E', // verde
  },

  freelance: {
    icon: 'laptop-outline',
    color: '#14B8A6', // turquesa
  },

  venta: {
    icon: 'pricetag-outline',
    color: '#84CC16', // lima
  },

  credito: {
    icon: 'card-outline',
    color: '#6366F1', // índigo
  },

  educacion: {
    icon: 'school-outline',
    color: '#8B5CF6', // púrpura
  },

  otros: {
    icon: 'cube-outline',
    color: '#71717A', // gris
  },
}

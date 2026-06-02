import { COLORES_CATEGORIA } from '@/constants/coloresCategorias'
import { useTheme } from '@/hooks/useThemeColor'
import { Transaccion } from '@/types/transaccion'
import { Text, useColorScheme, View } from 'react-native'
import { ThemedCard } from './ThemeCard'
import { ThemedText } from './ThemeText'

const CATEGORIA_EMOJI: Record<string, string> = {
  comida: '🍕',
  transporte: '🚗',
  entretenimiento: '🎬',
  salud: '💊',
  servicios: '💡',
  ropa: '👕',
  sueldo: '💼',
  freelance: '💻',
  venta: '🏷️',
  credito: '💳',
  otros: '📦',
}

interface Props {
  transaccion: Transaccion
}

export default function TransaccionCard({ transaccion }: Props) {
  const theme = useTheme()
  const colorScheme = useColorScheme()
  const emoji = CATEGORIA_EMOJI[transaccion.categoria] || '📦'
  const esIngreso = transaccion.tipo === 'ingreso'

  const categoriaColor = COLORES_CATEGORIA[transaccion.categoria]
  const cardBg = categoriaColor
    ? colorScheme === 'dark'
      ? categoriaColor.dark
      : categoriaColor.light
    : theme.card

  return (
    <ThemedCard className="rounded-xl px-4 py-6 mx-4 my-1.5 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <Text className="text-3xl">{emoji}</Text>
        <View>
          <ThemedText className=" text-base font-semibold ">
            {transaccion.descripcion}
          </ThemedText>
          <ThemedText
            variant="textSecondary"
            className="text-gray-400 text-xs mt-0.5 capitalize"
          >
            {transaccion.categoria} · {transaccion.fecha}
          </ThemedText>
        </View>
      </View>
      <ThemedText
        className="text-base font-bold"
        style={{ color: esIngreso ? theme.income : theme.expense }}
      >
        {esIngreso ? '+' : '-'}${transaccion.monto}
      </ThemedText>
    </ThemedCard>
  )
}

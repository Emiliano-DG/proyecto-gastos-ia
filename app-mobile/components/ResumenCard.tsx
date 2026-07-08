import { ThemedText } from '@/components/ThemeText'
import { useTheme } from '@/hooks/useThemeColor'
import { router } from 'expo-router'
import { Pressable, View } from 'react-native'

interface Props {
  tipo: 'ingreso' | 'gasto'
  monto: number
}

export function ResumenCard({ tipo, monto }: Props) {
  const theme = useTheme()

  const dotColor = tipo === 'ingreso' ? theme.income : theme.expense
  const label = tipo === 'ingreso' ? 'Ingresos' : 'Gastos'

  return (
    <View className="flex-1">
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/grupos/[tipo]',
            params: { tipo },
          })
        }}
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
      >
        <View className="p-4 rounded-xl" style={{ backgroundColor: theme.card }}>
        <View className="flex-row items-center gap-2 mb-1">
          <View
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
          <ThemedText variant="textSecondary" className="text-xs">
            {label}
          </ThemedText>
        </View>
        <ThemedText className="text-lg font-bold">
          ${monto.toLocaleString('es-AR')}
        </ThemedText>
      </View>
    </Pressable>
    </View>
  )
}

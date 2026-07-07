import { useTheme } from '@/hooks/useThemeColor'
import { View } from 'react-native'
import { ThemedCard } from './ThemeCard'
import { ThemedText } from './ThemeText'

interface Props {
  balance: number
  ingresos?: number
  egresos?: number
  mode?: 'default' | 'compact'
}

export function BalanceCard({
  balance,
  ingresos,
  egresos,
  mode = 'default',
}: Props) {
  const theme = useTheme()
  const balanceColor = balance >= 0 ? theme.income : theme.expense

  return (
    <ThemedCard
      hasBorder
      className={`mx-5 mt-5 mb-10 p-6 rounded-2xl ${
        mode === 'compact'
          ? 'h-auto items-center justify-center'
          : 'h-40 justify-between'
      }`}
    >
      <View>
        <ThemedText
          variant="textSecondary"
          className="text-xs font-semibold uppercase tracking-wider"
        >
          Balance Disponible
        </ThemedText>
        <ThemedText
          variant="text"
          className="text-3xl font-bold mt-2 tracking-tight"
          style={mode === 'compact' ? { color: balanceColor } : undefined}
        >
          ${balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </ThemedText>
      </View>

      {/* si no es compact, mostrar ingresos y egresos */}
      {mode !== 'compact' && (
        <View className="flex-row justify-between items-center">
          <View className="flex-row  items-center gap-2 ">
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.income }}
            />
            <ThemedText variant="textSecondary" className="text-xs">
              Ingresos: $
              {ingresos?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </ThemedText>

            <View
              className="w-2 h-2 rounded-full ml-8"
              style={{ backgroundColor: theme.expense }}
            />
            <ThemedText variant="textSecondary" className="text-xs">
              Egresos: $
              {egresos?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </ThemedText>
          </View>
        </View>
      )}
    </ThemedCard>
  )
}

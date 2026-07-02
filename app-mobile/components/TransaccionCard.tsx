import { CATEGORIAS } from '@/constants/categorias'
import { useTheme } from '@/hooks/useThemeColor'
import { Transaccion } from '@/types/transaccion'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useColorScheme, View } from 'react-native'
import { ThemedCard } from './ThemeCard'
import { ThemedText } from './ThemeText'

interface Props {
  transaccion: Transaccion
}

export default function TransaccionCard({ transaccion }: Props) {
  const theme = useTheme()
  const colorScheme = useColorScheme()
  const esIngreso = transaccion.tipo === 'ingreso'

  const categoriaInfo = CATEGORIAS[transaccion.categoria] ?? CATEGORIAS.otros

  return (
    <ThemedCard
      className="rounded-xl px-4 py-6 mx-4 my-1.5 flex-row items-center justify-between"
      hasBorder
      style={{
        borderRadius: 18,
      }}
    >
      <View className="flex-row items-center gap-3 flex-1 mr-2">
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: `${categoriaInfo.color}20`,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Ionicons
            name={categoriaInfo.icon}
            size={20}
            color={categoriaInfo.color}
          />
        </View>
        <View style={{ flexShrink: 1 }}>
          <ThemedText
            className=" text-base font-semibold "
            numberOfLines={1}
            ellipsizeMode="tail"
          >
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
        style={{
          color: esIngreso ? theme.income : theme.expense,
          flexShrink: 0,
        }}
      >
        {esIngreso ? '+' : '-'}${transaccion.monto}
      </ThemedText>
    </ThemedCard>
  )
}

import { ThemedCard } from '@/components/ThemeCard'
import { ThemedText } from '@/components/ThemeText'
import { ThemeView } from '@/components/ThemeView'
import { useTheme } from '@/hooks/useThemeColor'
import { useTransaccionCompleta } from '@/hooks/useTransaccionCompleta'
import { useDateStore } from '@/stores/useDateStore'
import { agruparPorCategoria } from '@/utils/finance'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable } from 'react-native-gesture-handler'
import { FlatList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function CategoriaScreen() {
  const { nombre, tipo } = useLocalSearchParams<{
    nombre: string
    tipo: string
  }>()
  const router = useRouter()
  const theme = useTheme()
  // hook de zustand para manejar el mes seleccionado
  const selectedMonth = useDateStore((state) => state.selectedMonth)

  // Traer todas las transacciones
  const { data: transaccion } = useTransaccionCompleta(
    selectedMonth.getMonth(),
    selectedMonth.getFullYear(),
  )

  const gastosPorCategoria = agruparPorCategoria(
    transaccion || [],
    tipo as 'gasto' | 'ingreso',
  )

  const total = gastosPorCategoria[nombre] ?? 0

  const movimientos = (transaccion ?? []).filter(
    (m) => m.categoria === nombre && m.tipo === (tipo as 'gasto' | 'ingreso'),
  )

  const esIngreso = tipo === 'ingreso'

  return (
    <ThemeView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center px-5 py-4 gap-3">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="chevron-back" size={24} color={theme.icon} />
          </Pressable>
          <ThemedText className="text-xl font-bold capitalize">
            {nombre}
          </ThemedText>
        </View>

        {/* Total de la categoría */}
        <View className="px-5 mb-4">
          <ThemedCard className="p-4 rounded-xl">
            <ThemedText variant="textSecondary" className="text-sm mb-1">
              Total de la categoría
            </ThemedText>
            <ThemedText className="text-2xl font-bold">
              ${total.toLocaleString('es-AR')}
            </ThemedText>
            <ThemedText
              variant="textSecondary"
              className="text-xs mt-1 capitalize"
            >
              {movimientos.length} movimiento
              {movimientos.length !== 1 ? 's' : ''}
            </ThemedText>
          </ThemedCard>
        </View>

        {/* Lista de movimientos */}
        <FlatList
          data={movimientos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          renderItem={({ item }) => (
            <ThemedCard className="p-4 rounded-xl flex-row justify-between items-center">
              <View className="flex-1">
                <ThemedText className="font-medium capitalize">
                  {item.descripcion}
                </ThemedText>
                <ThemedText variant="textSecondary" className="text-xs mt-0.5">
                  {item.fecha}
                </ThemedText>
              </View>
              <ThemedText
                className="text-base font-bold"
                style={{ color: esIngreso ? theme.income : theme.expense }}
              >
                {esIngreso ? '+' : '-'}${item.monto.toLocaleString('es-AR')}
              </ThemedText>
            </ThemedCard>
          )}
          ListEmptyComponent={
            <ThemedText className="text-center mt-10" variant="textSecondary">
              No hay gastos en esta categoría
            </ThemedText>
          }
        />
      </SafeAreaView>
    </ThemeView>
  )
}

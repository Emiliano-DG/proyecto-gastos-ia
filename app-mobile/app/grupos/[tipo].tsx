import { ThemedCard } from '@/components/ThemeCard'
import { ThemedText } from '@/components/ThemeText'
import { ThemeView } from '@/components/ThemeView'
import { useTheme } from '@/hooks/useThemeColor'
import { useTransaccionCompleta } from '@/hooks/useTransaccionCompleta'
import { useDateStore } from '@/stores/useDateStore'
import {
  agruparPorCategoria,
  calcularVariacion,
  calculateBalance,
} from '@/utils/finance'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { FlatList, Pressable, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function CategoriaScreen() {
  const { tipo } = useLocalSearchParams<{
    tipo: string
  }>()
  const router = useRouter()
  const theme = useTheme()

  const selectedMonth = useDateStore((state) => state.selectedMonth)
  const { data: transaccion } = useTransaccionCompleta(
    selectedMonth.getMonth(),
    selectedMonth.getFullYear(),
  )

  const { gastos } = calculateBalance(transaccion ?? [])

  const gastosPorCategoria = agruparPorCategoria(
    transaccion || [],
    tipo as 'gasto' | 'ingreso',
  )

  //Convertir a un array para poder usar .map()
  const categoriasArray: [string, number][] = Object.entries(gastosPorCategoria)

  //FILTRAR MOVIMIENTOS DEL MES ANTERIOR
  const previousMonth = new Date(selectedMonth)
  previousMonth.setMonth(previousMonth.getMonth() - 1)
  const { data: transaccionAnterior } = useTransaccionCompleta(
    previousMonth.getMonth(),
    previousMonth.getFullYear(),
  )
  const gastosPorCategoriaAnterior = agruparPorCategoria(
    transaccionAnterior || [],
    tipo as 'gasto' | 'ingreso',
  )

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
            {tipo}
          </ThemedText>
        </View>

        {categoriasArray.length > 0 && (
          <View className="px-7 flex-1">
            <FlatList
              data={categoriasArray.sort((a, b) => b[1] - a[1])}
              renderItem={({ item: [nombre, total] }) => {
                const porcentaje = gastos > 0 ? (total / gastos) * 100 : 0
                const variacion = calcularVariacion(
                  total,
                  gastosPorCategoriaAnterior[nombre] || 0,
                )
                return (
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: '/categoria/[nombre]',
                        params: {
                          nombre,
                          tipo,
                        },
                      })
                    }}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <ThemedCard className="p-4 rounded-lg mt-3">
                      {/* Fila 1 — nombre y monto */}
                      <View className="flex-row justify-between items-center mb-3" style={{ flexShrink: 1 }}>
                        <ThemedText className="font-semibold capitalize" numberOfLines={1} ellipsizeMode="tail">
                          {nombre}
                        </ThemedText>
                        <ThemedText className="font-bold">
                          ${total.toLocaleString('es-AR')}
                        </ThemedText>
                      </View>

                      {/* Fila 2 — barra, porcentaje, comparativa */}
                      <View className="flex-row items-center gap-3">
                        <View
                          className="flex-1 h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: theme.background }}
                        >
                          <View
                            style={{
                              width: `${porcentaje}%`,
                              height: '100%',
                              backgroundColor: theme.primary,
                            }}
                          />
                        </View>

                        <ThemedText className="text-xs font-semibold w-10 text-right">
                          {porcentaje.toFixed(0)}%
                        </ThemedText>

                        {variacion !== null && (
                          <ThemedText
                            className="text-xs font-semibold w-16 text-right"
                            style={{
                              color:
                                tipo === 'ingreso'
                                  ? variacion > 0
                                    ? theme.income
                                    : theme.expense
                                  : variacion > 0
                                    ? theme.expense
                                    : theme.income,
                            }}
                          >
                            {variacion >= 0 ? '▲' : '▼'}{' '}
                            {Math.abs(variacion).toFixed(0)}%
                          </ThemedText>
                        )}
                      </View>
                    </ThemedCard>
                  </Pressable>
                )
              }}
              keyExtractor={([nombre]) => nombre}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              contentContainerStyle={{ paddingTop: 16 }}
            />
          </View>
        )}
      </SafeAreaView>
    </ThemeView>
  )
}

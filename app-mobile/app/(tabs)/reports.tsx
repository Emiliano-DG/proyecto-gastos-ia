import { ThemedText } from '@/components/ThemeText'
import { ThemeView } from '@/components/ThemeView'
import { useTheme } from '@/hooks/useThemeColor'
import { useTransaccionCompleta } from '@/hooks/useTransaccionCompleta'
import { useDateStore } from '@/stores/useDateStore'
import {
  agruparPorCategoria,
  calculateBalance,
  filtrarMes,
  prepararDatosChart,
} from '@/utils/finance'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Pressable, View } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ReportScreen() {
  const theme = useTheme()
  const {
    data: transaccion,
    isLoading: cargando,
    error,
  } = useTransaccionCompleta()

  // hook de zustand para manejar el mes seleccionado
  const selectedMonth = useDateStore((state) => state.selectedMonth)
  const changeMonth = useDateStore((state) => state.changeMonth)

  //FILTRAR MOVIMIENTOS DEL MES SELECCIONADO
  const filteredMovements = filtrarMes(transaccion ?? [], selectedMonth)

  //Calculamos balance global, ingresos y gastos del mes seleccionado
  const { ingresos, gastos } = calculateBalance(filteredMovements ?? [])

  // Formatear el mes para mostrarlo en la UI
  const monthLabel = selectedMonth.toLocaleString('es-AR', {
    month: 'long',
    year: 'numeric',
  })

  //  Agrupar gastos por categoría
  const gastosPorCategoria = agruparPorCategoria(filteredMovements || [])

  //  Convertir a un array para poder usar .map()
  const categoriasArray: [string, number][] = Object.entries(gastosPorCategoria)

  //Graficos de torta para mostrar los gastos por categoría
  const datosChart = prepararDatosChart(gastosPorCategoria)

  const pieData = datosChart.map((d) => ({
    value: d.valor,
    color: d.color,
  }))

  return (
    <ThemeView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Encabezado con selector de mes */}
        <View className="flex-row items-center justify-between px-7 py-4">
          <Pressable
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            onPress={() => changeMonth(-1)}
          >
            <Ionicons name="chevron-back" size={24} color={theme.icon} />
          </Pressable>
          <View
            style={{ backgroundColor: theme.card }}
            className="px-5 py-2 rounded-2xl"
          >
            <ThemedText className=" font-medium text-lg">
              {monthLabel.toLocaleUpperCase()}
            </ThemedText>
          </View>

          <Pressable
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            onPress={() => changeMonth(1)}
          >
            <Ionicons name="chevron-forward" size={24} color={theme.icon} />
          </Pressable>
        </View>
        {/* Grafico de torta */}
        {datosChart.length > 0 && (
          <View className="items-center mt-4">
            <PieChart
              data={pieData}
              donut
              radius={90}
              innerRadius={60}
              backgroundColor={theme.background}
              centerLabelComponent={() => (
                <View className="items-center ">
                  <ThemedText variant="textSecondary" className="text-xs">
                    Total
                  </ThemedText>
                  <ThemedText className="text-lg font-bold">
                    ${gastos.toLocaleString('es-AR')}
                  </ThemedText>
                </View>
              )}
            />

            {/* Leyenda con colores */}
            <View className="flex-row flex-wrap justify-center gap-3 mt-4 px-4">
              {datosChart.map((d) => (
                <View key={d.nombre} className="flex-row items-center gap-1.5">
                  <View
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <ThemedText className="text-xs capitalize">
                    {d.nombre}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Cards de resumen siempre visibles  */}
        <View className="px-7 mt-6">
          <View className="flex-row gap-3 mb-2">
            {/* Card de ingreso */}
            <Pressable
              onPress={() => {
                router.push({
                  pathname: '/grupos/[tipo]',
                  params: {
                    tipo: 'ingreso',
                  },
                })
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="flex-1"
            >
              <View
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: theme.card,
                }}
              >
                <View className="flex-row items-center gap-2 mb-1">
                  <View
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: theme.income }}
                  />
                  <ThemedText variant="textSecondary" className="text-xs">
                    Ingresos
                  </ThemedText>
                </View>
                <ThemedText className="text-lg font-bold">
                  ${ingresos.toLocaleString('es-AR')}
                </ThemedText>
              </View>
            </Pressable>
            {/* Card de gasto  */}
            <Pressable
              onPress={() => {
                router.push({
                  pathname: '/grupos/[tipo]',
                  params: {
                    tipo: 'gasto',
                  },
                })
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="flex-1"
            >
              <View
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: theme.card,
                }}
              >
                <View className="flex-row items-center gap-2 mb-1">
                  <View
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: theme.expense }}
                  />
                  <ThemedText variant="textSecondary" className="text-xs">
                    Gastos
                  </ThemedText>
                </View>
                <ThemedText className="text-lg font-bold">
                  ${gastos.toLocaleString('es-AR')}
                </ThemedText>
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ThemeView>
  )
}

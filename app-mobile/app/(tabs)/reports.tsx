import { BalanceCard } from '@/components/BalanceCard'
import { Loading } from '@/components/Loading'
import { ResumenCard } from '@/components/ResumenCard'
import { ThemedText } from '@/components/ThemeText'
import { ThemeView } from '@/components/ThemeView'
import { useTheme } from '@/hooks/useThemeColor'
import { useTransaccionCompleta } from '@/hooks/useTransaccionCompleta'
import { useDateStore } from '@/stores/useDateStore'
import {
  agruparPorCategoria,
  calculateBalance,
  prepararDatosChart,
} from '@/utils/finance'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, View } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ReportScreen() {
  const theme = useTheme()

  // hook de zustand para manejar el mes seleccionado
  const selectedMonth = useDateStore((state) => state.selectedMonth)
  const changeMonth = useDateStore((state) => state.changeMonth)

  // Traer todas las transacciones filtradas por mes
  const {
    data: transaccion,
    isLoading: cargando,
    error,
  } = useTransaccionCompleta(
    selectedMonth.getMonth(),
    selectedMonth.getFullYear(),
  )

  // Mostrar indicador de carga mientras se obtienen los datos
  if (cargando) return <Loading />

  //Calculamos balance global, ingresos y gastos del mes seleccionado
  const { ingresos, gastos } = calculateBalance(transaccion ?? [])

  // Formatear el mes para mostrarlo en la UI
  const monthLabel = selectedMonth.toLocaleString('es-AR', {
    month: 'long',
    year: 'numeric',
  })

  //  Agrupar gastos por categoría
  const gastosPorCategoria = agruparPorCategoria(transaccion || [])

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
        {/* Card de balance del mes seleccionado */}
        <BalanceCard balance={ingresos - gastos} mode="compact" />
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
                    Gastos
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
            <ResumenCard tipo="ingreso" monto={ingresos} />
            <ResumenCard tipo="gasto" monto={gastos} />
          </View>
        </View>
      </SafeAreaView>
    </ThemeView>
  )
}

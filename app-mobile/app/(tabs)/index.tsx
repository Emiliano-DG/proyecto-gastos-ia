import { BalanceCard } from '@/components/BalanceCard'
import { Loading } from '@/components/Loading'
import { ThemeView } from '@/components/ThemeView'
import TransaccionCard from '@/components/TransaccionCard'
import { useTheme } from '@/hooks/useThemeColor'
import { useTransaccionCompleta } from '@/hooks/useTransaccionCompleta'
import { useDateStore } from '@/stores/useDateStore'
import { calculateBalance } from '@/utils/finance'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const theme = useTheme()

  const selectedMonth = useDateStore((state) => state.selectedMonth)
  const {
    data: transaccion,
    isLoading: cargando,
    error,
    refetch,
  } = useTransaccionCompleta(
    selectedMonth.getMonth(),
    selectedMonth.getFullYear(),
  )

  //onst { data: balance, isLoading: cargandoBalance } = useBalance()

  const { ingresos, gastos, TransaccionBalance } = calculateBalance(
    transaccion ?? [],
  )

  // Mostrar indicador de carga mientras se obtienen los datos
  if (cargando) return <Loading />
  // 2. SI HAY ERROR: Mostramos una interfaz de error con opción a reintentar
  if (error) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: theme.background }}
      >
        <Text className="text-3xl mb-2">⚠️</Text>
        <Text className="text-white text-lg font-semibold text-center mb-2">
          Ups, algo salió mal
        </Text>
        <Text className="text-gray-400 text-sm text-center mb-6">
          {error?.message || 'Error inesperado'}
        </Text>

        {/* Botón para volver a ejecutar cargarDatos() */}
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-[#1D9BF0] px-6 py-3 rounded-xl"
        >
          <Text className="text-[#13131f] font-bold">Volver a intentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ThemeView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <FlatList
          data={transaccion}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransaccionCard transaccion={item} />}
          ListHeaderComponent={
            <BalanceCard
              balance={TransaccionBalance ?? 0}
              ingresos={ingresos ?? 0}
              egresos={gastos ?? 0}
            />
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          ListEmptyComponent={
            <Text className="text-gray-500 text-center mt-10">
              No hay movimientos todavía
            </Text>
          }
        />
      </SafeAreaView>
    </ThemeView>
  )
}

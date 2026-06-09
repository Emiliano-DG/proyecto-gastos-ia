import { BalanceCard } from '@/components/BalanceCard'
import { ThemeView } from '@/components/ThemeView'
import TransaccionCard from '@/components/TransaccionCard'
import { useTransaccion } from '@/hooks/useTransaccion'
import { calculateBalance } from '@/utils/finance'
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const {
    data: transaccion,
    isLoading: cargando,
    error,
    refetch: refrescarTransaccion,
  } = useTransaccion()

  // Mostrar indicador de carga mientras se obtienen los datos
  if (cargando) {
    return (
      <View className="flex-1 justify-center items-center bg-[#13131f]">
        <ActivityIndicator size="large" color="#1D9BF0" />
      </View>
    )
  }

  // 2. SI HAY ERROR: Mostramos una interfaz de error con opción a reintentar
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#13131f] px-6">
        <Text className="text-3xl mb-2">⚠️</Text>
        <Text className="text-white text-lg font-semibold text-center mb-2">
          Ups, algo salió mal
        </Text>
        <Text className="text-gray-400 text-sm text-center mb-6">{error}</Text>

        {/* Botón para volver a ejecutar cargarDatos() */}
        <TouchableOpacity
          onPress={refrescarTransaccion}
          className="bg-[#1D9BF0] px-6 py-3 rounded-xl"
        >
          <Text className="text-[#13131f] font-bold">Volver a intentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const { TransaccionBalance, ingresos, gastos } = calculateBalance(
    transaccion ?? [],
  )

  return (
    <ThemeView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <FlatList
          data={transaccion}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransaccionCard transaccion={item} />}
          ListHeaderComponent={
            <BalanceCard
              balance={TransaccionBalance}
              ingresos={ingresos}
              egresos={gastos}
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

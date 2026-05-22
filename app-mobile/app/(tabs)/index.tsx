import { ThemedText } from '@/components/ThemeText'
import { ThemeView } from '@/components/ThemeView'
import GastoCard from '@/components/TransaccionCard'
import { useTransaccion } from '@/hooks/useTransaccion'
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export default function HomeScreen() {
  const { transaccion, cargando, error, refrescarTransaccion } =
    useTransaccion()

  // Mostrar indicador de carga mientras se obtienen los datos
  if (cargando) {
    return (
      <View className="flex-1 justify-center items-center bg-[#13131f]">
        <ActivityIndicator size="large" color="#4ade80" />
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
          className="bg-[#4ade80] px-6 py-3 rounded-xl"
        >
          <Text className="text-[#13131f] font-bold">Volver a intentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ThemeView className="flex-1  pt-16">
      <ThemedText className=" text-2xl font-bold ml-4 mb-4">
        Mis Movimientos 💸
      </ThemedText>
      <FlatList
        data={transaccion}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GastoCard transaccion={item} />}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">
            No hay movimientos todavía
          </Text>
        }
      />
    </ThemeView>
  )
}

import GastoCard from '@/components/GastoCard'
import { supabase } from '@/lib/supabase'
import { Transaccion } from '@/types/transaccion'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'

export default function HomeScreen() {
  const [gastos, setGastos] = useState<Transaccion[]>([])
  const [cargando, setCargando] = useState(true)

  // Carga de datos al montar el componente
  useEffect(() => {
    async function cargarDatos() {
      const { data, error } = await supabase
        .from('transacciones')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Error al cargar transacciones:', error.message)
      } else {
        setGastos(data ?? [])
      }
      setCargando(false)
    }
    cargarDatos()
  }, [])

  // Mostrar indicador de carga mientras se obtienen los datos
  if (cargando) {
    return (
      <View className="flex-1 justify-center items-center bg-[#13131f]">
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    )
  }

  return (
    <View className="flex-1  pt-16">
      <Text className=" text-2xl font-bold ml-4 mb-4">Mis Movimientos 💸</Text>
      <FlatList
        data={gastos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GastoCard transaccion={item} />}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">
            No hay movimientos todavía
          </Text>
        }
      />
    </View>
  )
}

import { Transaccion } from '@/types/transaccion'
import { Text, View } from 'react-native'

const CATEGORIA_EMOJI: Record<string, string> = {
  comida: '🍕',
  transporte: '🚗',
  entretenimiento: '🎬',
  salud: '💊',
  servicios: '💡',
  ropa: '👕',
  sueldo: '💼',
  freelance: '💻',
  venta: '🏷️',
  otros: '📦',
}

interface Props {
  transaccion: Transaccion
}

export default function GastoCard({ transaccion }: Props) {
  const emoji = CATEGORIA_EMOJI[transaccion.categoria] || '📦'
  const esIngreso = transaccion.tipo === 'ingreso'

  return (
    <View className="bg-[#1e1e2e] rounded-xl px-4 py-3 mx-4 my-1.5 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <Text className="text-3xl">{emoji}</Text>
        <View>
          <Text className="text-white text-base font-semibold ">
            {transaccion.descripcion}
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5 capitalize">
            {transaccion.categoria} · {transaccion.fecha}
          </Text>
        </View>
      </View>
      <Text
        className={`text-base font-bold ${esIngreso ? 'text-green-400' : 'text-red-400'}`}
      >
        {esIngreso ? '+' : '-'}${transaccion.monto}
      </Text>
    </View>
  )
}

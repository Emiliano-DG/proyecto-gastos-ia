import { Transaccion } from "@/types/transaccion";
import { Text, View } from "react-native";
import { ThemedCard } from "./ThemeCard";
import { ThemedText } from "./ThemeText";
import { useTheme } from "@/hooks/useThemeColor";

const CATEGORIA_EMOJI: Record<string, string> = {
  comida: "🍕",
  transporte: "🚗",
  entretenimiento: "🎬",
  salud: "💊",
  servicios: "💡",
  ropa: "👕",
  sueldo: "💼",
  freelance: "💻",
  venta: "🏷️",
  otros: "📦",
};

interface Props {
  transaccion: Transaccion;
}

export default function TransaccionCard({ transaccion }: Props) {
  const theme = useTheme();
  const emoji = CATEGORIA_EMOJI[transaccion.categoria] || "📦";
  const esIngreso = transaccion.tipo === "ingreso";

  return (
    <ThemedCard className="rounded-xl px-4 py-6 mx-4 my-1.5 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <Text className="text-3xl">{emoji}</Text>
        <View>
          <ThemedText className=" text-base font-semibold ">
            {transaccion.descripcion}
          </ThemedText>
          <Text className="text-gray-400 text-xs mt-0.5 capitalize">
            {transaccion.categoria} · {transaccion.fecha}
          </Text>
        </View>
      </View>
      <ThemedText
        className="text-base font-bold"
        style={{ color: esIngreso ? theme.income : theme.expense }}
      >
        {esIngreso ? "+" : "-"}${transaccion.monto}
      </ThemedText>
    </ThemedCard>
  );
}

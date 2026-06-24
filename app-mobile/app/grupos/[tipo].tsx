import { ThemedCard } from "@/components/ThemeCard";
import { ThemedText } from "@/components/ThemeText";
import { ThemeView } from "@/components/ThemeView";
import { useTheme } from "@/hooks/useThemeColor";
import { useTransaccionCompleta } from "@/hooks/useTransaccionCompleta";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoriaScreen() {
  const { tipo, mes, anio } = useLocalSearchParams<{
    tipo: string;
    mes: string;
    anio: string;
  }>();
  const router = useRouter();
  const theme = useTheme();

  const { data: transaccion } = useTransaccionCompleta();

  // Filtrar por categoría y mes
  // const movimientos = (transaccion ?? []).filter((m) => {
  //   const [year, month] = m.fecha.split("-").map(Number);
  //   return (
  //     m.categoria === nombre &&
  //     m.tipo === "gasto" &&
  //     month - 1 === Number(mes) &&
  //     year === Number(anio)
  //   );
  // });
  // Calcular total gastado en la categoría
  // const total = movimientos.reduce((acc, m) => acc + m.monto, 0);

  return (
    <ThemeView className="flex-1">
      <SafeAreaView className="flex-1" edges={["top"]}>
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
      </SafeAreaView>
    </ThemeView>
  );
}

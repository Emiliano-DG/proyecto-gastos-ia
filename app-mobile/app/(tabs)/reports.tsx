import { ThemedCard } from "@/components/ThemeCard";
import { ThemedText } from "@/components/ThemeText";
import { ThemeView } from "@/components/ThemeView";
import { useTheme } from "@/hooks/useThemeColor";
import { useTransaccionCompleta } from "@/hooks/useTransaccionCompleta";
import { calculateBalance } from "@/utils/finance";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportScreen() {
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const {
    data: transaccion,
    isLoading: cargando,
    error,
  } = useTransaccionCompleta();

  // Funciones para cambiar el mes
  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedMonth(newDate);
  };

  // Filtrar movimientos del mes seleccionado
  const filteredMovements = transaccion?.filter((movement) => {
    // Parsear la fecha en formato YYYY-MM-DD de forma local (sin afectar zona horaria)
    const [year, month, day] = movement.fecha.split("-").map(Number);
    const movementDate = new Date(year, month - 1, day);
    return (
      movementDate.getMonth() === selectedMonth.getMonth() &&
      movementDate.getFullYear() === selectedMonth.getFullYear()
    );
  });

  //Calculamos balance global, ingresos y gastos del mes seleccionado
  const { TransaccionBalance, ingresos, gastos } = calculateBalance(
    filteredMovements ?? [],
  );

  // Formatear el mes para mostrarlo en la UI
  const monthLabel = selectedMonth.toLocaleString("es-AR", {
    month: "long",
    year: "numeric",
  });

  //  Agrupar gastos por categoría
  const gastosPorCategoria = (filteredMovements || [])
    .filter((m) => m.tipo === "gasto") // Solo nos interesan los gastos
    .reduce(
      (acc, current) => {
        const categoria = current.categoria || "Otros";
        if (!acc[categoria]) {
          acc[categoria] = 0;
        }
        acc[categoria] += current.monto;
        return acc;
      },
      // esto se hace para que TypeScript entienda que el acumulador es un objeto con claves de string y valores numéricos
      {} as Record<string, number>,
    );

  //  Convertir a un array para poder usar .map()
  const categoriasArray: [string, number][] =
    Object.entries(gastosPorCategoria);

  return (
    <ThemeView className="flex-1">
      <SafeAreaView className="flex-1" edges={["top"]}>
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
        {/* Lista de gastos por categoría */}
        {categoriasArray.length > 0 ? (
          <View className="px-7 mt-6 flex-1">
            {/* Mostramos total ingresos */}
            <ThemedText>
              Ingresos ${ingresos.toLocaleString("es-AR")}
            </ThemedText>
            <View
              className="w-2 h-2 rounded-full ml-8"
              style={{ backgroundColor: theme.income }}
            />
            {/* Mostramos total egresos */}
            <ThemedText>Gastos ${gastos.toLocaleString("es-AR")}</ThemedText>
            <View
              className="w-2 h-2 rounded-full ml-8"
              style={{ backgroundColor: theme.expense }}
            />

            <ScrollView className="mt-4" style={{ gap: 12 }}>
              {categoriasArray
                .sort((a, b) => b[1] - a[1]) // Ordenamos de mayor a menor
                .map(([nombre, total]) => {
                  const porcentaje = gastos > 0 ? (total / gastos) * 100 : 0;

                  return (
                    <Pressable
                      key={nombre}
                      onPress={() => {
                        router.push({
                          pathname: "/categoria/[nombre]",
                          params: {
                            nombre,
                            mes: selectedMonth.getMonth().toString(),
                            anio: selectedMonth.getFullYear().toString(),
                          },
                        });
                      }}
                      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    >
                      <ThemedCard
                        key={nombre}
                        className="flex-row items-center justify-between p-4 rounded-lg mt-4"
                      >
                        <View>
                          <ThemedText className="font-semibold">
                            {nombre}
                          </ThemedText>
                          <ThemedText
                            variant="textSecondary"
                            className="text-sm"
                          >
                            ${total.toLocaleString("es-AR")}
                          </ThemedText>
                        </View>

                        <View className="h-4 flex-1 ml-4 rounded-full overflow-hidden">
                          <View
                            style={[
                              {
                                width: `${porcentaje}%`,
                                height: "100%",
                                backgroundColor: theme.primary,
                              },
                            ]}
                          />
                        </View>
                        <ThemedText className="ml-3 w-12 text-right text-sm font-semibold">
                          {porcentaje.toFixed(0)}%
                        </ThemedText>
                      </ThemedCard>
                    </Pressable>
                  );
                })}
            </ScrollView>
          </View>
        ) : null}
      </SafeAreaView>
    </ThemeView>
  );
}

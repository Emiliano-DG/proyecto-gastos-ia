import { CATEGORIAS } from "@/constants/categorias";
import { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    monto: number;
    categoria: string;
    fecha: string;
    descripcion: string;
    tipo: "ingreso" | "gasto";
  }) => void;
  isPending?: boolean;
}

export function TransaccionModal({
  visible,
  onClose,
  onSave,
  isPending,
}: Props) {
  const [tipo, setTipo] = useState<"ingreso" | "gasto">("gasto");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("otros");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);

  const handleSave = () => {
    const montoNum = parseFloat(monto);
    if (!descripcion.trim() || isNaN(montoNum) || montoNum <= 0) return;

    onSave({
      monto: montoNum,
      categoria,
      fecha,
      descripcion: descripcion.trim(),
      tipo,
    });

    // Reset
    setDescripcion("");
    setMonto("");
    setCategoria("otros");
    setFecha(new Date().toISOString().split("T")[0]);
    setTipo("gasto");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onPress={onClose}
        >
          <Pressable
            style={{
              backgroundColor: "#1e1e2e",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "85%",
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                Nueva Transacción
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Tipo toggle */}
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
              {(["gasto", "ingreso"] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTipo(t)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor:
                      tipo === t
                        ? t === "gasto"
                          ? "#EF4444"
                          : "#22C55E"
                        : "#2a2a3e",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Descripción */}
            <TextInput
              placeholder="Descripción"
              placeholderTextColor="#6b7280"
              value={descripcion}
              onChangeText={setDescripcion}
              style={{
                backgroundColor: "#2a2a3e",
                color: "white",
                borderRadius: 10,
                padding: 12,
                marginBottom: 12,
                fontSize: 15,
              }}
            />

            {/* Monto */}
            <TextInput
              placeholder="$ Monto"
              placeholderTextColor="#6b7280"
              value={monto}
              onChangeText={setMonto}
              keyboardType="numeric"
              style={{
                backgroundColor: "#2a2a3e",
                color: "white",
                borderRadius: 10,
                padding: 12,
                marginBottom: 12,
                fontSize: 15,
              }}
            />

            {/* Fecha */}
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#6b7280"
              value={fecha}
              onChangeText={setFecha}
              style={{
                backgroundColor: "#2a2a3e",
                color: "white",
                borderRadius: 10,
                padding: 12,
                marginBottom: 12,
                fontSize: 15,
              }}
            />

            {/* Categorías */}
            <Text
              style={{
                color: "#9ca3af",
                fontSize: 12,
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              Categoría
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 16 }}
            >
              {Object.keys(CATEGORIAS).map((cat) => {
                const info = CATEGORIAS[cat];
                const selected = categoria === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategoria(cat)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: selected ? `${info.color}30` : "#2a2a3e",
                      borderWidth: 1,
                      borderColor: selected ? info.color : "transparent",
                      marginRight: 8,
                    }}
                  >
                    <Ionicons name={info.icon} size={16} color={info.color} />
                    <Text
                      style={{
                        color: "white",
                        fontSize: 13,
                        textTransform: "capitalize",
                      }}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Botón guardar */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={isPending}
              style={{
                backgroundColor: tipo === "gasto" ? "#EF4444" : "#22C55E",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                opacity: isPending ? 0.6 : 1,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                {isPending ? "Guardando..." : "Guardar"}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

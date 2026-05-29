import { useTheme } from "@/hooks/useThemeColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

// funcion para renderizar el icono de la pestaña
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          // 1. Posicionamiento flotante
          position: "absolute",
          bottom: 60, // Margen respecto al borde inferior
          left: 50, // Margen izquierdo
          right: 50, // Margen derecho

          // 2. Estilo visual
          backgroundColor: theme.tabBar, // El azul oscuro de la imagen
          borderRadius: 40, // Bordes muy redondeados
          height: 65, // Un poco más alta para que luzca mejor

          // 3. Sombra y bordes (iOS y Android)
          borderTopWidth: 0, // Eliminamos la línea superior clásica
          elevation: 5, // Sombra en Android
          shadowColor: "#000", // Sombra en iOS
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 10,

          // 4. Espaciado interno
          paddingBottom: Platform.OS === "ios" ? 20 : 12,
          paddingTop: 12,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab One",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}

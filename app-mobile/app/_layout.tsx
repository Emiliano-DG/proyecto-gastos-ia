import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

// si una pantalla rompe, se mostrará el error en lugar de la pantalla rota
export { ErrorBoundary } from "expo-router";

// Pantalla inicial de la aplicación
export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// prevenir que la pantalla de carga se oculte automáticamente antes de que las fuentes estén cargadas
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
    ...Ionicons.font,
  });

  // si hay un error al cargar las fuentes, lanza el error para que se muestre en la pantalla de error
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // cuando las fuentes estén cargadas, oculta la pantalla de carga
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="categoria/[nombre]"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="grupos/[tipo]" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

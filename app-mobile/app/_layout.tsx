import FontAwesome from '@expo/vector-icons/FontAwesome'

import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'
import '../global.css'

// si una pantalla rompe, se mostrará el error en lugar de la pantalla rota
export { ErrorBoundary } from 'expo-router'

// Pantalla inicial de la aplicación
export const unstable_settings = {
  initialRouteName: '(tabs)',
}

// prevenir que la pantalla de carga se oculte automáticamente antes de que las fuentes estén cargadas
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  // si hay un error al cargar las fuentes, lanza el error para que se muestre en la pantalla de error
  useEffect(() => {
    if (error) throw error
  }, [error])

  // cuando las fuentes estén cargadas, oculta la pantalla de carga
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}

import { useTheme } from '@/hooks/useThemeColor'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function TabBarIcon({
  name,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap
  color: string
}) {
  return <Ionicons name={name} size={22} color={color} />
}
export default function TabLayout() {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarShowLabel: false,
        // Use safe area insets to size the tab bar so the border stays at the
        //top edge and icons can be aligned toward the top of the tab.
        tabBarItemStyle: {
          justifyContent: 'flex-start',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: 40 + insets.bottom,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: insets.bottom,
          paddingTop: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home-sharp" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="stats-chart-sharp" color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

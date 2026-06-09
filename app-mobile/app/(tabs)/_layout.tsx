import { useTheme } from '@/hooks/useThemeColor'
import { FontAwesome6 } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function TabBarIcon({ name, color }: { name: string; color: string }) {
  return <FontAwesome6 name={name} size={22} color={color} />
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
          tabBarIcon: ({ color }) => <TabBarIcon name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="file-invoice" color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

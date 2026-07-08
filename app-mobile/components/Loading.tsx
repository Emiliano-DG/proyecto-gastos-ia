import { useTheme } from '@/hooks/useThemeColor'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

export function Loading() {
  const theme = useTheme()

  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: theme.background }}
    >
      <ActivityIndicator size="large" color="#1D9BF0" />
    </View>
  )
}

import { View, ViewProps } from 'react-native'
import { useTheme } from '../hooks/useThemeColor'

export function ThemeView(props: ViewProps) {
  const theme = useTheme()

  return (
    <View
      {...props}
      style={[{ backgroundColor: theme.background }, props.style]}
    />
  )
}

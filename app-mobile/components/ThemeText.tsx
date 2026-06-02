import { useTheme } from '@/hooks/useThemeColor'
import { Text, TextProps } from 'react-native'

interface Props extends TextProps {
  variant?: 'text' | 'textSecondary'
}

export function ThemedText({ variant = 'text', style, ...props }: Props) {
  const theme = useTheme()

  const textColor = theme[variant]

  return (
    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      {...props}
      style={[{ color: textColor }, style]}
    />
  )
}

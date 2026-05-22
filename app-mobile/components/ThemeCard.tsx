import { useTheme } from '@/hooks/useThemeColor'
import { View } from 'react-native'

interface Props {
  variant?: 'primary' | 'secondary'
  style?: object
  children: React.ReactNode
}

export function ThemedCard({ style, variant, ...props }: Props) {
  const theme = useTheme()

  const background = variant === 'secondary' ? theme.cardSecondary : theme.card

  return <View {...props} style={[{ backgroundColor: background }, style]} />
}

import { useTheme } from '@/hooks/useThemeColor'
import { View } from 'react-native'

interface Props {
  // variant?: "primary" | "secondary";
  style?: object
  children?: React.ReactNode
  className?: string
  backgroundColor?: string
  hasBorder?: boolean
}

export function ThemedCard({
  style,
  backgroundColor,
  hasBorder = false,
  ...props
}: Props) {
  const theme = useTheme()

  const background = backgroundColor ?? theme.card

  return (
    <View
      {...props}
      style={[
        { backgroundColor: background },
        hasBorder && { borderColor: theme.border, borderWidth: 1 },
        style,
      ]}
    />
  )
}

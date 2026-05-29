import { useTheme } from "@/hooks/useThemeColor";
import { View } from "react-native";

interface Props {
  // variant?: "primary" | "secondary";
  style?: object;
  children?: React.ReactNode;
  className?: string;
}

export function ThemedCard({ style, className, ...props }: Props) {
  const theme = useTheme();

  const background = theme.card;

  return (
    <View
      {...props}
      className={className}
      style={[{ backgroundColor: background }, style]}
    />
  );
}

import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";

interface Props {
  onPress: () => void;
}

export function FloatingButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-8 right-6 w-16 h-16 rounded-full bg-[#1D9BF0] items-center justify-center shadow-lg"
      style={{
        shadowColor: "#1D9BF0",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Ionicons name="add" size={32} color="white" />
    </TouchableOpacity>
  );
}

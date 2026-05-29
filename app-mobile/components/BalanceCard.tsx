import { View, Text } from "react-native";

// components/BalanceCard.tsx
type Props = {
  balance: number;
  fecha: string;
};

export function BalanceCard({ balance, fecha }: Props) {
  return (
    <View
      className="mx-5 mt-5 mb-10 p-6 h-48 justify-between"
      style={{
        backgroundColor: "#FD7B41",
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
      }}
    >
      <View>
        <Text className="text-white/80 text-lg font-medium">Balance</Text>
        <Text className="text-white text-4xl font-bold mt-2">
          ${balance.toFixed(2)}
        </Text>
      </View>
      <View className="flex-row justify-end">
        <Text className="text-white/60 font-semibold text-base">{fecha}</Text>
      </View>
    </View>
  );
}

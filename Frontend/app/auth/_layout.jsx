import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function AuthLayout() {
  const navigation = useNavigation();

  return (
    <Stack
      screenOptions={{
        headerTitle: "Authentication",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.canGoBack() ? navigation.goBack() : null}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}
    />
  );
}

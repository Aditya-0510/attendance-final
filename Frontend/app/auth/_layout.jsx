import { Stack,useRouter} from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AuthLayout() {
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        // headerLeft: () => (
        //   <TouchableOpacity
        //     onPress={() => router.back()}
        //     style={{ marginLeft: 15 }}
        //   >
        //     <Ionicons name="arrow-back" size={30} color="black" />
        //   </TouchableOpacity>
        // ),
      }}
    />
  );
}

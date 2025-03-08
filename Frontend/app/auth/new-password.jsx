import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter, Stack,useLocalSearchParams } from "expo-router";
import Color from "../../constant/Color";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

export default function SignUpScreen() {
  const router = useRouter();

  const { email } = useLocalSearchParams();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async () => {
    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    const passwordData = {password,email};

    try {
      const response = await axios.post(
        "http://10.0.8.75:5000/user/reset",
        passwordData,
      );

      Alert.alert("Success", response.data.msg || "Signup successful!");
      router.push("/auth/sign-in");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          animation: "slide_from_right",
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.container}>
            <Text style={styles.textHeader}>Password Reset</Text>


            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={password}
                placeholder="Enter password"
                placeholderTextColor={Color.GRAY}
                secureTextEntry={true}
                onChangeText={(text) => setPassword(String(text))}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={confirmPassword}
                placeholder="Confirm password"
                placeholderTextColor={Color.GRAY}
                secureTextEntry={true}
                onChangeText={(text) => setConfirmPassword(String(text))}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={onSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "#e6f2ff",
    borderColor: "#cce0ff",
    overflow: "hidden",
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#000",
  },
  pickerPlaceholder: {
    color: "#000",
  },
  textHeader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Color.PRIMARY,
  },
  inputContainer: {
    marginBottom: 15,
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "#e6f2ff",
    borderColor: "#cce0ff",
    fontSize: 16,
    color: "#000",
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: Color.PRIMARY,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
    width: "70%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

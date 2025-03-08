import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import Color from "../../constant/Color";
import axios from "axios";

export default function FacultySignUpScreen() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const validateEmailDomain = (email) => {
    return email.endsWith("@iiitdwd.ac.in");
  };

  const onSignUpPress = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (!validateEmailDomain(email)) {
      Alert.alert("Invalid Email", "Please use your @iiitdwd.ac.in email.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    const SignUpData = { name, email, password };

    try {
      const response = await axios.post(
        "http://10.0.8.75:5000/admin/signup",
        SignUpData
      );

      Alert.alert("Success", response.data.msg || "Signup successful!");
      router.push("/auth/faculty-otp");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data.msg === "string"
      ) {
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.container}>
              <Text style={styles.textHeader}>Faculty Sign Up</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  placeholder="Enter name"
                  placeholderTextColor={Color.GRAY}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  autoCapitalize="none"
                  value={email}
                  placeholder="Enter email (must end with @iiitdwd.ac.in)"
                  placeholderTextColor={Color.GRAY}
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  placeholder="Enter password"
                  placeholderTextColor={Color.GRAY}
                  secureTextEntry={true}
                  onChangeText={setPassword}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={confirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor={Color.GRAY}
                  secureTextEntry={true}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={onSignUpPress}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Continue</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => router.push("/auth/faculty-sign-in")}
                  disabled={loading}
                >
                  <Text style={styles.secondaryButtonText}>
                    Already have an account? Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
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
    borderRadius: 15,
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
    borderRadius: 15,
    marginTop: 20,
    alignItems: "center",
    width: "70%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Color.PRIMARY,
    marginTop: 10,
  },
  secondaryButtonText: {
    color: Color.PRIMARY,
    fontSize: 12,
  },
});


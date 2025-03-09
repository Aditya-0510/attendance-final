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
  Modal,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import Color from "../../constant/Color";
import axios from "axios";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmailAddress] = React.useState("");
  const [roll, setrollno] = React.useState("");
  const [batch, setBatch] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  
  const batches = ["CSE", "ECE", "DSAI"];

  const validateEmailDomain = (email: string) => {
    return email.endsWith("@iiitdwd.ac.in");
  };

  const onSignUpPress = async () => {
    if (!name.trim() || !email.trim() || !roll.trim() || !batch) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (!validateEmailDomain(email)) {
      Alert.alert("Invalid Email", "Please use your @iiitdwd.ac.in email.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    const SignUpData = { name, roll, email, password, batch };

    try {
      const response = await axios.post(
        `${API_URL}/user/signup`,
        SignUpData
      );

      Alert.alert("Success", response.data.msg || "Signup successful!");
      router.push("/auth/otp");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, animation: "slide_from_right" }} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.container}>
            <Text style={styles.textHeader}>Sign Up</Text>

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
                value={email}
                placeholder="Enter email"
                placeholderTextColor={Color.GRAY}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={roll}
                placeholder="Enter Roll number"
                placeholderTextColor={Color.GRAY}
                onChangeText={setrollno}
                autoCapitalize="none"
              />
            </View>

            {/* Batch Selection Modal */}
            <TouchableOpacity style={styles.modalTrigger} onPress={() => setModalVisible(true)}>
              <Text style={batch ? styles.selectedBatchText : styles.placeholderText}>
                {batch ? batch : "Select Batch"}
              </Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Select Your Batch</Text>
                  {batches.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.modalOption} onPress={() => {
                      setBatch(item);
                      setModalVisible(false);
                    }}>
                      <Text style={styles.modalText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalCloseText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={password}
                placeholder="Enter password"
                placeholderTextColor={Color.GRAY}
                secureTextEntry
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={confirmPassword}
                placeholder="Confirm password"
                placeholderTextColor={Color.GRAY}
                secureTextEntry
                onChangeText={setConfirmPassword}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={onSignUpPress} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Continue</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/sign-in")} disabled={loading}>
                <Text style={styles.buttonText}>Sign In</Text>
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
    color: "#888",
  },
  modalTrigger: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "#e6f2ff",
    borderColor: "#cce0ff",
    fontSize: 16,
    marginBottom: 15,
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
  },
  selectedBatchText: {
    color: "#000",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    width: 300,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalOption: {
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
  },
  modalCloseButton: {
    marginTop: 15,
    alignItems: "center",
  },
  modalCloseText: {
    color: "red",
    fontSize: 16,
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
});

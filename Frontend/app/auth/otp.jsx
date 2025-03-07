import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import React, { useState } from "react";
import Color from "../../constant/Color";
import axios from "axios";

export default function Otp() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const SignInData = { otp };

  const onSubmit = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://10.0.8.75:5000/user/verify-otp",
        SignInData,
        {}
      );
      Alert.alert(response.data.msg);

      const success = response.data.success;
      if (success) {
        router.push("/auth/sign-in");
      } else {
        router.push("/auth/sign-up");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.textHeader}>Email Verification</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="OTP"
            style={styles.textInput}
            placeholderTextColor={Color.GRAY}
            autoCapitalize="none"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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

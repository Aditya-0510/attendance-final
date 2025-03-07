import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import Color from "../../constant/Color";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

export default function SignUpScreen() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmailAddress] = React.useState("");
  const [roll, setrollno] = React.useState("");
  const [batch, setBatch] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const validateEmailDomain = (email) => {
    const validDomain = "@iiitdwd.ac.in";
    return email.endsWith(validDomain);
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
    const SignUpData = { name, roll, email, password, batch };

    try {
      const response = await axios.post(
        "http://10.0.8.75:5000/user/signup",
        SignUpData
      );
      console.log("hellouii");

      Alert.alert("Success", response.data.msg || "Signup successful!");
      router.push("/auth/otp");
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
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.textHeader}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            placeholder="Enter name"
            placeholderTextColor={Color.GRAY}
            onChangeText={(text) => setName(String(text))}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            value={email}
            placeholder="Enter email"
            placeholderTextColor={Color.GRAY}
            onChangeText={(text) => setEmailAddress(String(text))}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            value={roll}
            placeholder="Enter Roll number"
            placeholderTextColor={Color.GRAY}
            onChangeText={(text) => setrollno(String(text))}
          />
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={batch}
            onValueChange={(itemValue) => setBatch(itemValue)}
            style={[
              styles.picker,
              batch === "" ? styles.pickerPlaceholder : null,
            ]}
          >
            <Picker.Item label="Select Batch" value="" enabled={false} />
            <Picker.Item label="CSE" value="CSE" />
            <Picker.Item label="ECE" value="ECE" />
            <Picker.Item label="DSAI" value="DSAI" />
          </Picker>
        </View>

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
            style={styles.button}
            onPress={() => router.push("/auth/sign-in")}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Sign In</Text>
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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "#e6f2ff",
    borderColor: "#cce0ff",
    overflow: "hidden", // Ensures content stays inside the border
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

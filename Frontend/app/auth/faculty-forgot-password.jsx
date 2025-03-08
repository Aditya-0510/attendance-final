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
  
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
  
    const emailData = { email };
  
    const onSubmit = async () => {
      if (!email.trim()) {
        Alert.alert("Error", "Please enter the email");
        return;
      }
      console.log(emailData)
  
      setLoading(true);
  
      try {
        const response = await axios.post(
          "http://10.0.8.75:5000/admin/forget-admin",
          emailData,
          {}
        );
        
        const done = response.data.done
        // console.log(done);
  
        if (done) {
            Alert.alert(response.data.msg);
            router.push(
                { 
                    pathname: "/auth/faculty-forgot-otp", 
                    params: { email } 
                }
            )
        } else {
            Alert.alert(response.data.msg)
          router.push("/auth/faculty-sign-up");
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong. Please try again."+error);
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
        <View style={styles.container}>
          <Text style={styles.textHeader}>Forgot Password</Text>
  
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              placeholderTextColor={Color.GRAY}
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
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
  });
  
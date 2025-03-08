import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter , Stack} from "expo-router";

export default function UserSelect() {
  const router = useRouter();

  return (
    <>
    <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_right", // Enables the sliding transition
        }}
      />
    <View style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/sign-in-edited.png")}
          style={styles.image}
          resizeMode="contain"
        />
        
      </View>

      {/* Buttons*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/sign-in")}>
            <Text style={styles.buttonText}>Student</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/faculty-sign-in")}>
            <Text style={styles.buttonText}>Faculty</Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6C6F2", // Light purple background
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: "100%", // Takes full width
    alignItems: "center",
    marginBottom: 40, // Space between image and buttons
  },
  image: {
    width: 250, // Adjust size to match UI
    height: 250,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 20, // This will add spacing between buttons (React Native 0.71+)
  },
  button: {
    backgroundColor: "#1E73E8", // Blue color matching UI
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 20, // Rounded corners
    width: "70%", // Button width to match design
    alignItems: "center",
    marginBottom: 15, // Space between buttons
    elevation: 3, // Shadow effect
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  secondButton: {
    marginTop: 20, // Increase gap between buttons
  },
});
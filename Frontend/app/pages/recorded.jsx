import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function Recorded() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Recorded</Text>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.text}>Class: Computer Science 101</Text>
        <Text style={styles.text}>Date: {new Date().toLocaleDateString()}</Text>
        <Text style={styles.text}>Duration: 1.5 hours</Text>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push("(tabs)")}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#D0C8F2"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "green",
    marginBottom: 20
  },
  detailsContainer: {
    marginBottom: 30
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333"
  },
  button: {
    backgroundColor: "#1E73E8",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 25,
    elevation: 3
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "bold"
  }
});
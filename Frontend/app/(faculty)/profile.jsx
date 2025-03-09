import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert,ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function MenuScreen() {
  const [username, setUsername] = useState("Guest");
  const [email, setEmail] = useState("Guest@iiitdwd.ac.in");
  const [loading, setLoading] = useState(false);

  // Get auth token from AsyncStorage
  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  // Fetch user profile data from the backend
  const fetchUserData = async () => {
    try {
      const name = await AsyncStorage.getItem("name");
      const em = await AsyncStorage.getItem("rollno");

      setUsername(name);
      setEmail(em);
    } catch (error) {
      console.error("Error fetching user details:", error);
      Alert.alert("Error", "Failed to load user details.");
    }
  };

  fetchUserData();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("name");
      await AsyncStorage.removeItem("email");
      router.replace("/auth/userselect");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImage}>
            <FontAwesome
              name="user"
              size={50}
              color="#1E73E8"
              style={{ textAlign: "center" }}
            />
          </View>
          <Text style={styles.profileName}>{username} </Text>
          <Text style={styles.profileRole}>{email} </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleSignOut}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Sign Out</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    backgroundColor: "#f5f5f5",
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    color: "#1E73E8",
    fontWeight: "600",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: "#1E73E8",
    opacity: 0.8,
  },
  buttonsContainer: {
    marginTop: "auto",
    marginBottom: 40,
    alignItems: "center",
    gap: 12,
  },
  button: {
    backgroundColor: "#1E73E8",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    width: "70%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});

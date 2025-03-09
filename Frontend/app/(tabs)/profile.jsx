import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function MenuScreen() {
  const [username, setUsername] = useState("Guest");
  const [rollno, setRollno] = useState("No Roll number");
  const [loading, setLoading] = useState(false); // 🔴 Added loading state

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
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "Authentication token missing.");
        return;
      }

      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: { token },
      });

      if (response.data) {
        setUsername(response.data.Name || "Guest");
        setRollno(response.data.rollno || "No Roll number");
      } else {
        console.warn("Empty response from server.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      Alert.alert("Error", "Failed to load user details.");
    }
  };

  // Handle sign-out by clearing auth data and navigating
  const handleSignOut = async () => {
    try {
      setLoading(true); // 🔴 Start loading state
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "Authentication token missing.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/user/signout`,
        {},
        { headers: { token } }
      );

      const ongoing = response.data.ongoing;
      Alert.alert(response.data.msg);

      if (!ongoing) {
        await AsyncStorage.removeItem("authToken");
        router.replace("/auth/userselect");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out.");
    } finally {
      setLoading(false); // 🔴 Stop loading state
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
          <Text style={styles.profileRole}>{rollno} </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]} // 🔴 Disable button when loading
            onPress={handleSignOut}
            disabled={loading} // 🔴 Prevent multiple clicks
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" /> // 🔴 Show loader
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
  disabledButton: {
    backgroundColor: "#A0C3FF", // Lighter shade to indicate disabled state
  },
});


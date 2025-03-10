import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function Index() {
  const router = useRouter();
  const [username, setUsername] = useState("Guest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      return token;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  const getUser = async () => {
    try {
      return await AsyncStorage.getItem("name");
    } catch (error) {
      console.error("Error retrieving name:", error);
      return null;
    }
  };

  const fetchUserData = async () => {
    try {
      const user = await getUser();
      console.log(user);
      setUsername(user);
      if (!user) {
        Alert.alert("Error", "User missing");
        return;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      Alert.alert("Error", "Failed to load user details.");
    }
  };

  fetchUserData();

  const fetchClassDetails = async () => {
    setLoading(true);
    setError(null); // Reset error before making a request
    try {
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/admin/checker`, {
        headers: { token: token },
      });

      console.log(response.data);

      if (response.data?.ongoing) {
        Alert.alert(
          "Class in Progress",
          "A class is currently going on. You cannot create a new class."
        );
      } else {
        router.push("pages/start-class");
      }
    } catch (err) {
      console.error("Error fetching class details:", err);
      setError(err.response?.data?.message || "Failed to fetch class details");
      Alert.alert("Error", "Failed to fetch class details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={fetchClassDetails}
            disabled={loading}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="play-circle-outline" size={22} color="black" />
            </View>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Start a class</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("pages/current-class")}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="schedule" size={22} color="black" />
            </View>
            <Text style={styles.buttonText}>Current class</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("pages/course-select-report")}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="assignment" size={22} color="black" />
            </View>
            <Text style={styles.buttonText}>Attendance Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("pages/faculty-courses")}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="menu-book" size={22} color="black" />
            </View>
            <Text style={styles.buttonText}>Your Courses</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light background for contrast
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  buttonContainer: {
    alignItems: "center",
    gap: 15,
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E73E8",
    marginBottom: 15,
    textTransform: "capitalize",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "black",
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 30,
    alignItems: "center",
    marginRight: 10,
  },
});

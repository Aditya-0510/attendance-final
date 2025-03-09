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
  const [loading, setLoading] = useState(false); 

  const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return token;
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
};

  const getDetails = async () => {
    try {
      const name =  await AsyncStorage.getItem("name");
      const rn =  await AsyncStorage.getItem("rollno");

      setUsername(name)
      setRollno(rn)
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  getDetails();

  const handleSignOut = async () => {
    try {
      setLoading(true); 
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
        await AsyncStorage.removeItem("name");
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("batch");
        await AsyncStorage.removeItem("rollno");
        router.replace("/auth/userselect");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out.");
    } finally {
      setLoading(false); 
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
          <Text style={styles.profileRole}>{rollno} </Text>
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
  disabledButton: {
    backgroundColor: "#A0C3FF", // Lighter shade to indicate disabled state
  },
});


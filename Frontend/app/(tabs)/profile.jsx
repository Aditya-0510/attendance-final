import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function MenuScreen() {
  const [username, setUsername] = useState("Guest");
  const [rollno, setRollno] = useState("No Roll number");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUsername(user.name || "Guest");
          setRollno(user.rollno || "No Roll Number");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
      router.replace("/auth/userselect");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleChangeAcc = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
      router.replace("/auth/sign-in");
    } catch (error) {
      console.error("Error changing account:", error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImage}>
            {/* {profileImageUrl ? (
              <Image 
                source={{ uri: profileImageUrl }} 
                style={styles.imageProfile}
                resizeMode="cover"
              />
            ) : ( */}
              <FontAwesome 
                name="user" 
                size={50} 
                color="#1E73E8" 
                style={{ textAlign: "center" }} 
              />
            {/* )} */}
          </View>
          <Text style={styles.profileName}>{username}</Text>
          <Text style={styles.profileRole}>{rollno}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleChangeAcc}>
            <Text style={styles.buttonText}>Change Account</Text>
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
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 0,
    marginTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
    borderRadius: 75,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageProfile: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  profileName: {
    fontSize: 18,
    color: "#1E73E8",
    marginBottom: 4,
    fontWeight: "500",
  },
  profileRole: {
    fontSize: 14,
    color: "#1E73E8",
    opacity: 0.8,
  },
  buttonsContainer: {
    marginTop: "auto",
    marginBottom: 40,
    alignItems: "center",
    gap: 3,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    width: "70%",
    backgroundColor: "#1E73E8",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
});

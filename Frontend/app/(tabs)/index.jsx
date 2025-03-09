import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React,{useEffect,useState} from "react";
import { useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'; 
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function index() {
    const router = useRouter();
    const [username, setUsername] = useState("Guest");

    const getToken = async () => {
      try {
        return await AsyncStorage.getItem('authToken');
      } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
      }
    };
    const fetchUserData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          Alert.alert('Error', 'Authentication token missing.');
          return;
        }
  
        const response = await axios.get(`${API_URL}/user/profile`, {
          headers: { token }
        });
        console.log("data"+response.data.Name);
        if (response.data) {
          setUsername(response.data.Name || "Guest");
        } else {
          console.warn("Empty response from server.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        Alert.alert("Error", "Failed to load user details.");
      }
    };
    useEffect(() => {
        fetchUserData();
      }, []);


  return (
    <>
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
          <View style={styles.container1}>
            <View style={styles.imageContainerChart}>
              <Image
                source={require("../../assets/images/iiitlogo.png")}
                style={styles.imageChart}
                resizeMode="contain"
              />
            </View>

            <View style={styles.buttonContainer1}>
              <TouchableOpacity 
                style={styles.button1}
                onPress={()=>router.push("user-pages/user-ongoing")}
              >
                <Text style={styles.buttonText1}>Current Class</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.button1}
                onPress={()=>router.push("user-pages/course")}
            >
                <Text style={styles.buttonText1}>Course Analytics</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> 
        </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F7FA", // Soft background for a premium feel
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
    letterSpacing: 0.5, // More refined spacing
  },
  imageContainerChart: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imageChart: {
    width: 260,
    height: 260,
    marginVertical: 8,
  },
  container1: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonContainer1: {
    width: "100%",
    alignItems: "center",
    gap: 15,
    marginTop: 8,
  },
  button1: {
    backgroundColor: "#1E73E8",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
    width: "85%", // Ensuring both buttons have the same width
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonText1: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});

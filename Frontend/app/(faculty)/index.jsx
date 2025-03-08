import { StyleSheet, Text, View, TouchableOpacity,Alert } from 'react-native'
import React ,{useState,useEffect} from 'react'
import { useRouter} from "expo-router";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
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
  
        const response = await axios.get("http://10.0.8.75:5000/admin/profile", {
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={()=>router.push("pages/start-class")}>
            <Text style={styles.buttonText}>Start a class</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={()=>router.push("pages/current-class")}>
            <Text style={styles.buttonText}>Current class</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={()=>router.push("pages/course-select-report")}>
            <Text style={styles.buttonText}>Attendance Report</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress = {()=>router.push("pages/faculty-courses")}>
            <Text style={styles.buttonText}>Your Courses</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  welcomeText: {
    fontSize: 26,  // Bigger font size
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E73E8",  // Primary color
    marginBottom: 20,
    textTransform: "capitalize",  // Ensures first letter is uppercase
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
},
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
})
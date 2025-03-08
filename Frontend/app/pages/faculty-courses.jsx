import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter, Stack } from "expo-router";
import Header from "../../components/Fheader";
import { Ionicons } from "@expo/vector-icons";

export default function CourseList() {
  const router = useRouter();
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      return token;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  const fetchCourses = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "Authentication token missing.");
        return;
      }

      const response = await axios.get("http://10.0.8.75:5000/admin/courses", {
        headers: {
          token: token,
        },
      });

      console.log(response.data.courses);

      if (response.data.isthere) {
        setCourseList(response.data.courses);
      } else {
        setCourseList([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      Alert.alert("Error", "Failed to fetch courses.");
    }
  };

  return (
    <>
      {/* <Header/> */}
      <Stack.Screen
        options={{
          headerShown: true,
          animation: "slide_from_right",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace("(faculty)")}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={courseList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.courseItem}>
              <Text style={styles.courseText}>{item.title}</Text>
              <Text style={styles.courseTextTitle}>{item.coursecode}</Text>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("pages/add-course")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#F5F7FA", // Soft background for a clean UI
    },
    courseItem: {
      backgroundColor: "#ffffff", // White card for contrast
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 12, // Slightly rounded edges for a modern feel
      marginVertical: 8,
      width: "100%",
      borderWidth: 1, // Subtle border
      borderColor: "#E0E6ED", // Light gray border for a structured look
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 4, // Adds a soft shadow on Android
    },
    courseText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333", // Darker text for clarity
      textAlign: "left",
    },
    courseTextTitle: {
        fontSize: 14,
        color: "#666", // Lighter grey for contrast
      },
    addButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: "#007AFF", // iOS-style blue button
      borderRadius: 50,
      width: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    addButtonText: {
      fontSize: 28,
      fontWeight: "bold",
      color: "white",
    },
    backButton: {
      position: "absolute",
      top: 20,
      left: 20,
      backgroundColor: "#ffffff",
      padding: 10,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
  });
  

  

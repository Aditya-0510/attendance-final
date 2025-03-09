import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function Course() {
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
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

      const response = await axios.get(`${API_URL}/courses/preview`);
      if (response.data) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      Alert.alert("Error", "Failed to load courses.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "",
          animation: "slide_from_right",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("user-pages/notification")} style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.flatListContainer}>
        <FlatList
          data={courses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.courseCard}
              onPress={() =>
                router.push({
                  pathname: "user-pages/courseAttendance",
                  params: { coursecode: item.coursecode, title: item.title },
                })
              }
            >
              <Text style={styles.courseName}>{item.title || "No Title"}</Text>
              <Text style={styles.professorName}>{item.coursecode || "No Course Code"}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FA", // Softer background for contrast
  },
  flatListContainer: {
    marginTop: 20,
  },
  courseCard: {
    width: "92%", // Improved width for uniform spacing
    alignSelf: "center",
    backgroundColor: "#ffffff", // Clean white card
    padding: 18,
    marginVertical: 8,
    borderRadius: 12, // Modern rounded corners
    borderWidth: 1, // Subtle border
    borderColor: "#E0E6ED", // Soft grey border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // More depth
    shadowOpacity: 0.1, // Softer shadow
    shadowRadius: 6,
    elevation: 4, // Android shadow
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Darker text for readability
    marginBottom: 4,
  },
  professorName: {
    fontSize: 14,
    color: "#666", // Lighter grey for contrast
  },
  // backButton: {
  //   marginLeft: 15,
  //   padding: 10,
  //   borderRadius: 8,
  //   backgroundColor: "#FFFFFF",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 3 },
  //   shadowOpacity: 0.15,
  //   shadowRadius: 4,
  //   elevation: 4,
  // },
  // iconButton: {
  //   marginRight: 15,
  //   padding: 10,
  //   borderRadius: 8,
  //   backgroundColor: "#FFFFFF",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 3 },
  //   shadowOpacity: 0.15,
  //   shadowRadius: 4,
  //   elevation: 4,
  // },
});

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons"; // Import Icon for Back Button
import Header from "../../components/Fheader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function course() {
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

      const response = await axios.get(`${API_URL}/admin/courses`, {
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
    <View>
      {/* <Header /> */}
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

      <View style={styles.flatListContainer}>
        <FlatList
          data={courseList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.courseCard]}
              onPress={() =>
                router.push({
                  pathname: "pages/report",
                  params: { coursecode: item.coursecode, title: item.title },
                })
              }
            >
              <Text style={styles.courseName}>{item.title}</Text>
              <Text style={styles.professorName}>{item.coursecode}</Text>
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
    backgroundColor: "#F5F7FA", // Softer background color for better contrast
  },
  flatListContainer: {
    marginTop: 20,
  },
  courseCard: {
    width: "92%", // Slightly wider for better spacing
    alignSelf: "center",
    backgroundColor: "#ffffff", // Clean white card
    padding: 18,
    marginVertical: 8,
    borderRadius: 12, // More rounded corners for a modern look
    borderWidth: 1, // Subtle border
    borderColor: "#E0E6ED", // Soft grey border for contrast
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // More depth
    shadowOpacity: 0.1, // Softer shadow
    shadowRadius: 6,
    elevation: 4, // Android shadow
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#007AFF", // Blue highlight for selection
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});

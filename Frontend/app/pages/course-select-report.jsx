import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons"; // Import Icon for Back Button
import Header from "../../components/Fheader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

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
    <View>
      <Header />

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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  backButton: {
    position: "absolute",
    top: 25, // Adjust for better visibility
    left: 20,
    // backgroundColor: "#1E73E8",
    padding: 10,
    borderRadius: 10, // Makes it circular
    elevation: 5,
    zIndex: 10, // Ensures it stays above everything
  },
  flatListContainer: {
    marginTop: 40, // Adjust this value as needed
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  courseCard: {
    width: "90%", // Adjust width as needed
    alignSelf: "center", // Center the card
    backgroundColor: "#7DA3C3",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5, // Less rounded corners for boxy look
    borderWidth: 2, // Add a border
    borderColor: "#00509E", // Darker border for contrast
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // For Android shadow
  },

  selectedCard: {
    borderWidth: 3,
    borderColor: "#0066FF",
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  professorName: {
    fontSize: 14,
  },
});

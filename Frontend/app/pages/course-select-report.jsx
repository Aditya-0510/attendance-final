import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function Course() {
  const router = useRouter();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

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
    setLoading(true); // Start loading
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
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
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

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FA",
    // justifyContent: "center",
    // alignItems: "center",
  },
  loader: {
    marginTop: 20,
  },
  flatListContainer: {
    marginTop: 20,
    width: "100%",
  },
  courseCard: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: "#ffffff",
    padding: 18,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E6ED",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  professorName: {
    fontSize: 14,
    color: "#666",
  },
});


import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Course() {
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  // Function to get auth token
  const getToken = async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  // Fetch courses from the backend
  const fetchCourses = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Authentication token missing.');
        return;
      }
      
      const response = await axios.get('http://10.0.8.75:5000/courses/preview');
      // console.log("hiii")
      // console.log(response.data)

      if (response.data) {
        setCourses(response.data); 
      } else {
        // console.warn('Unexpected response structure:', response.data);
      }

      // console.log(courses)
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Error', 'Failed to load courses.');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // useEffect(() => {
  //   console.log('Updated courses:', courses); // Ensure re-renders happen
  // }, [courses]);

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.flatListContainer}>
        <FlatList
          data={courses}
          keyExtractor={(item) => item._id} 
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.courseCard}
              onPress={() =>
                router.push({
                  pathname: 'pages/courseAttendance',
                  params: { coursecode: item.coursecode, title: item.title }
                })
              }
              

            >
              <Text style={styles.professorName}>{item.coursecode || 'No Course Code'}</Text>
              <Text style={styles.courseName}>{item.title || 'No title'}</Text>
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
    backgroundColor: '#ffffff',
  },
  flatListContainer: {
    marginTop: 40,
    marginBottom:50
  },
  courseCard: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#7DA3C3',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#00509E',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  professorName: {
    fontSize: 14,
  },
});

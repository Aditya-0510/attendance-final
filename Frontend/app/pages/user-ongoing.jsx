import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from "../../components/header";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Notification() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ongoingClass, setOngoingClass] = useState(null);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const fetchOngoingClass = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Authentication token missing.');
        return;
      }

      const response = await axios.get("http://10.0.8.75:5000/user/checker", {
        headers: { 'token': token }
      });

      if (response.data.ongoing) {
        setOngoingClass(response.data.clas); // Assuming "clas" contains coursecode, title, etc.
      } else {
        setOngoingClass(null); // No ongoing class
      }
    } catch (error) {
      console.error('Error fetching ongoing class:', error);
      setError('Failed to fetch class data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOngoingClass();
  }, []);

  return (
    <>
      <Header />
      
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : ongoingClass ? (
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push("pages/location")}
        >
          <Text style={styles.header}>Class Started</Text>

          <Text style={styles.course}>➜ {ongoingClass.Title}</Text>
          <Text style={styles.course}>{ongoingClass.Hours} hrs</Text>
          {/* <Text style={styles.professor}>by {ongoingClass.Professor || 'Professor N/A'}</Text> */}
        </TouchableOpacity>
      ) : (
        <Text style={styles.noClass}>No ongoing classes at the moment.</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginTop: 50,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  noClass: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
    color: 'gray',
  },
  card: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 15,
    width: "80%",
    marginTop: 60,
    marginLeft: 25,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "black",
  },
  course: {
    fontSize: 18,
    marginTop: 5,
    color: "black",
  },
  professor: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 5,
    color: "black",
  }
});

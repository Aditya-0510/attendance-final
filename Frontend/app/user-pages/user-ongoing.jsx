
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, Platform,Dimensions } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Header from "../../components/header";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import axios from 'axios';
import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';
import * as Application from 'expo-application';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL || '${API_URL}';

export default function Notification() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ongoingClass, setOngoingClass] = useState(null);
  const [ipAddress, setIpAddress] = useState(null);

  // IP address handling moved to getDeviceId function

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
        setError('Authentication token missing.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/user/checker`, {
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

  // Updated useEffect to also fetch device ID
  useEffect(() => {
    fetchOngoingClass();
    getDeviceId();
  }, []);

  const getDeviceId = async () => {
    try {
      // First, try to retrieve a previously stored ID
      const storedId = await AsyncStorage.getItem('permanentDeviceId');
      if (storedId) {
        console.log('Using stored permanent device ID:', storedId);
        setIpAddress(storedId);
        return storedId;
      }
  
      // Generate device fingerprint from multiple sources
      const deviceFingerprint = generateDeviceFingerprint();
      
      // Store the fingerprint for future use
      await AsyncStorage.setItem('permanentDeviceId', deviceFingerprint);
      console.log('Generated and stored permanent device ID:', deviceFingerprint);
      
      // Set in state and return
      setIpAddress(deviceFingerprint);
      return deviceFingerprint;
    } catch (error) {
      console.error('Error generating device ID:', error);
      // If all fails, generate a temporary ID
      const tempId = `temp-${Date.now()}`;
      setIpAddress(tempId);
      return tempId;
    }
  };
  
  // Generate a consistent fingerprint based on device characteristics
  const generateDeviceFingerprint = () => {
    // Collect all available device information
    const deviceInfo = {
      // Expo Constants
      installationId: Constants.installationId || '',
      deviceId: Constants.deviceId || '',
      deviceName: Constants.deviceName || '',
      deviceYearClass: Constants.deviceYearClass?.toString() || '',
      
      // Platform specific
      os: Platform.OS,
      version: Platform.Version?.toString() || '',
      brand: Platform.OS === 'android' ? (Platform.constants?.Brand || '') : '',
      model: Platform.OS === 'android' ? (Platform.constants?.Model || '') : '',
      
      // Screen dimensions
      screenWidth: Dimensions.get('window').width.toString(),
      screenHeight: Dimensions.get('window').height.toString(),
      screenScale: Dimensions.get('window').scale.toString(),
      
      // Other available info
      userAgent: navigator?.userAgent || '',
      language: navigator?.language || '',
    };
    
    // Create a string from all these properties
    let fingerprint = '';
    for (const [key, value] of Object.entries(deviceInfo)) {
      if (value && typeof value === 'string') {
        fingerprint += value;
      }
    }
    
    // Create a hash from the string
    // Simple hash function
    const hash = str => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      // Convert to positive hex string
      return Math.abs(hash).toString(16);
    };
    
    return `device-${hash(fingerprint)}`;
  };

  // Updated attendanceChecker function
  const attendanceChecker = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Authentication token missing.');
        setLoading(false);
        return;
      }
      
      // Try to get the device ID from state, or fetch it again if not available
      let deviceId = ipAddress;
      if (!deviceId) {
        deviceId = await getDeviceId();
      }
      
      if (!deviceId) {
        Alert.alert('Error', 'Could not determine your device ID.');
        setLoading(false);
        return;
      }
      
      console.log(deviceId + " deviceId");
      
      const response = await axios.get(
        `${API_URL}/user/attendance-checker`, 
        {
          headers: { 'token': token },
          params: { ip: deviceId }  // Send as query parameter
        }
      );
      
      const marked = response.data.marked;
      console.log(response.data);
      console.log(marked);
      
      if (marked) {
        Alert.alert(response.data.msg);
      } else {
        router.push("user-pages/location");
      }
    } catch (error) {
      console.error('Error checking attendance:', error);
      setError('Failed to check attendance.');
      Alert.alert('Error', 'Failed to check attendance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShown: true,
          animation: "slide_from_right",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("user-pages/notification")}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : ongoingClass ? (
        <TouchableOpacity 
          style={styles.card}
          onPress={attendanceChecker}
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
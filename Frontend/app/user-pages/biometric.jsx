import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL; 

export default function Verification() {
  const [isAuthenticationSupported, setIsAuthenticationSupported] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [showRecordedMessage, setShowRecordedMessage] = useState(false);
  const [classDetails, setClassDetails] = useState(null);
  const router = useRouter();

  const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return token;
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
  };

  const fetchDetails = async() => {
    try {
      const token = await getToken();
      if (!token) {
          Alert.alert('Error', 'Authentication token missing.');
          return;
      }
      console.log("token"+token);
      const response = await axios.get(
        `${API_URL}/user/checker`,
        {
            headers: {
                'token': token,
            },
        });
      const classData = response.data.clas;
      setClassDetails(classData); // Update classDetails state
      console.log('Class details:', classData);
    } catch (error) {
      console.error('Error fetching class details:', error);
      Alert.alert('Error', 'Failed to fetch class details.');
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    checkAuthenticationSupport();
  }, []);

  const checkAuthenticationSupport = async () => {
    try {
      if (Platform.OS === 'ios') {
        // For iOS, we'll check if device authentication is available
        const compatible = await LocalAuthentication.hasHardwareAsync();
        console.log('Authentication hardware available:', compatible);
        
        // Set authentication as supported regardless of biometric availability
        // since we want to use passcode
        setIsAuthenticationSupported(true);
      } else {
        // For Android, we'll still use biometric authentication
        const compatible = await LocalAuthentication.hasHardwareAsync();
        console.log('Biometric hardware available:', compatible);
        
        if (!compatible) {
          setIsAuthenticationSupported(false);
          Alert.alert('Error', 'Biometric hardware not available');
          return;
        }

        const enrolled = await LocalAuthentication.isEnrolledAsync();
        console.log('Biometrics enrolled:', enrolled);
        
        if (!enrolled) {
          setIsAuthenticationSupported(false);
          Alert.alert(
            'Biometric Authentication Not Set Up', 
            'Please set up fingerprint or face recognition in your device settings to use this feature.',
            [{ text: 'OK' }]
          );
          return;
        }

        setIsAuthenticationSupported(true);
      }
    } catch (error) {
      console.error('Error checking authentication support:', error);
      setIsAuthenticationSupported(false);
      Alert.alert('Error', 'Failed to initialize authentication');
    }
  };

  const authenticateUser = async () => {
    if (isVerificationComplete) return;
    
    try {
      let authOptions;
      
      if (Platform.OS === 'ios') {
        // iOS-specific options to use device passcode
        authOptions = {
          promptMessage: 'Enter your passcode to verify attendance',
          disableDeviceFallback: false,
          fallbackLabel: '',
          cancelLabel: 'Cancel',
          // Enable device credentials (passcode)
          deviceCredentialAllowed: true
        };
      } else {
        // Android-specific options
        authOptions = {
          promptMessage: 'Authenticate to verify attendance',
          disableDeviceFallback: true,
          cancelLabel: "Cancel",
          fallbackLabel: '',
          requireConfirmation: false,
          sensitiveTransaction: true,
          allowDeviceCredentials: false
        };
      }
      
      console.log('Starting authentication with options:', authOptions);
      const result = await LocalAuthentication.authenticateAsync(authOptions);
      console.log('Authentication result:', result);
      
      if (result.success) {
        const token = await getToken();
        if (!token) {
            Alert.alert('Error', 'Authentication token missing.');
            return;
        }
        if (!classDetails) {
            Alert.alert('Error', 'Class details not available.');
            return;
        }
        
        const newDetails = {
          coursecode: classDetails.Coursecode,
          hour: classDetails.Hours,
          ispresent: result.success,
        };
        
        console.log(newDetails);
        await axios.post(
          `${API_URL}/user/mark-attendance`,
          newDetails,
          {
              headers: {
                  'token': token,
              },
          }
        );
        
        console.log('Authentication successful');
        setIsAuthenticated(true);
        setIsVerificationComplete(true);
        setShowRecordedMessage(true);
        setTimeout(() => {
          router.replace("user-pages/recorded");
        }, 2000);
      } else if (result.error === 'user_cancel') {
        console.log('User cancelled authentication');
      } else {
        console.log('Authentication failed:', result.error);
        setIsAuthenticated(false);
        Alert.alert(
          'Authentication Failed',
          'Please try again to verify your attendance.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setIsAuthenticated(false);
      Alert.alert(
        'Authentication Error',
        'An error occurred during authentication. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
            options={{
               headerShown: false,
               animation: "slide_from_right",
            }}
         />
      <Image 
        source={require("../../assets/images/logo-new-edited.jpg")} 
        style={styles.image} 
        resizeMode="contain" 
      />
      <Text style={styles.title}>
        {Platform.OS === 'ios' ? 'Passcode Authentication' : 'Biometric Authentication'}
      </Text>
      
      {showRecordedMessage ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✅ Attendance Recorded Successfully!</Text>
          <Text style={styles.redirectText}>Redirecting...</Text>
        </View>
      ) : isAuthenticationSupported === null ? (
        <Text style={styles.text}>Checking for authentication support...</Text>
      ) : isAuthenticationSupported ? (
        <View>
          <Text style={styles.text}>
            {Platform.OS === 'ios' 
              ? 'Please authenticate using your device passcode'
              : 'Please authenticate using your biometrics'}
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={authenticateUser}
          >
            <Text style={styles.buttonText}>
              {Platform.OS === 'ios' ? 'Use Passcode' : 'Authenticate'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.text}>
          {Platform.OS === 'ios' 
            ? "Authentication is not available on this device."
            : "Biometric authentication is not available on this device."}
        </Text>
      )}
      
      {!isAuthenticated && !isVerificationComplete && (
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => router.push("(tabs)")}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#D0C8F2"
  },
  image: {
    width: 240,
    height: 240,
    marginBottom: 30
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    width: "90%",
    marginBottom: 30
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center"
  },
  button: {
    backgroundColor: "#1E73E8",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 25,
    elevation: 3
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "bold"
  },
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 10,
    textAlign: "center"
  },
  redirectText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center"
  }
});
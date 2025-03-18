import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Application from 'expo-application';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL; 

export default function Verification() {
  const [isAuthenticationSupported, setIsAuthenticationSupported] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [showRecordedMessage, setShowRecordedMessage] = useState(false);
  const [classDetails, setClassDetails] = useState(null);
  const router = useRouter();
  const [ipAddress, setIpAddress] = useState(null);
  const [authMethod, setAuthMethod] = useState('biometric'); // 'biometric' or 'device'

// Add this function to fetch the IP
// const fetchUserIP = async () => {
//   try {
//     // Using ipify API to get the user's public IP address
//     const response = await axios.get('https://api.ipify.org?format=json');
//     const userIP = response.data.ip;
//     console.log('User IP:', userIP);
//     setIpAddress(userIP);
//     return userIP;
//   } catch (error) {
//     console.error('Error fetching IP address:', error);
//     return null;
//   }
// };
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
    
    // Screen dimensions (if needed)
    screenWidth: Dimensions.get('window').width.toString(),
    screenHeight: Dimensions.get('window').height.toString(),
    screenScale: Dimensions.get('window').scale.toString(),
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
    getDeviceId(); // Fetch the IP address when component mounts
  }, []);

  useEffect(() => {
    checkAuthenticationSupport();
  }, []);

  const checkAuthenticationSupport = async () => {
    try {
      // Check if device has biometric hardware
      const hasBiometricHardware = await LocalAuthentication.hasHardwareAsync();
      console.log('Biometric hardware available:', hasBiometricHardware);
      
      // Check if device has biometrics enrolled
      const hasBiometricsEnrolled = await LocalAuthentication.isEnrolledAsync();
      console.log('Biometrics enrolled:', hasBiometricsEnrolled);
      
      // Check what authentication types are available
      const supportedAuthTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log('Supported auth types:', supportedAuthTypes);
      
      // Check if any authentication is available (including passcode)
      const secureAuthAvailable = await LocalAuthentication.isEnrolledAsync();
      
      if (hasBiometricHardware && hasBiometricsEnrolled) {
        // Biometric is available and enrolled
        setAuthMethod('biometric');
        setIsAuthenticationSupported(true);
      } else {
        // Fall back to device authentication (passcode/pattern/pin)
        console.log('Falling back to device authentication');
        setAuthMethod('device');
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
      // Set up authentication options based on available methods
      const authOptions = {
        promptMessage: 'Authenticate to verify attendance',
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
        fallbackLabel: 'Use passcode instead',
        // Always allow device credentials as fallback
        deviceCredentialAllowed: true
      };
      
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
        
        // Ensure IP address is available
        let deviceId = ipAddress;
      if (!deviceId) {
        deviceId = await getDeviceId();
      }
        
      if (!deviceId) {
        Alert.alert('Error', 'Could not determine your device ID.');
        return;
      }
        
        const newDetails = {
          coursecode: classDetails.Coursecode,
          hour: classDetails.Hours,
          ispresent: result.success,
          ip: deviceId
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
        {authMethod === 'biometric' ? 'Biometric Authentication' : 'Device Authentication'}
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
            {authMethod === 'biometric' 
              ? 'Please authenticate using your biometrics'
              : 'Please authenticate using your device passcode/pattern'}
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={authenticateUser}
          >
            <Text style={styles.buttonText}>
              {authMethod === 'biometric' ? 'Use Biometrics' : 'Use Device Authentication'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.text}>
          Authentication is not available on this device.
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
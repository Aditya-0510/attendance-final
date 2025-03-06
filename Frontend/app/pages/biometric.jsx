import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

export default function Verification() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(null);
  const [biometricType, setBiometricType] = useState(null);
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

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      console.log('Biometric hardware available:', compatible);
      
      if (!compatible) {
        setIsBiometricSupported(false);
        Alert.alert('Error', 'Biometric hardware not available');
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      console.log('Biometrics enrolled:', enrolled);
      
      if (!enrolled) {
        setIsBiometricSupported(false);
        const message = Platform.OS === 'ios' 
          ? 'Please set up Face ID in your device settings to use this feature.'
          : 'Please set up fingerprint or face recognition in your device settings to use this feature.';
        Alert.alert('Biometric Authentication Not Set Up', message, [{ text: 'OK' }]);
        return;
      }

      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log('Supported authentication types:', types);
      setIsBiometricSupported(true);

      if (Platform.OS === 'ios') {
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType("Face ID");
        } else {
          setIsBiometricSupported(false);
          Alert.alert('Error', 'Face ID is required for this feature');
        }
      } else {
        if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType("Fingerprint");
        } else if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType("Face Recognition");
        } else {
          setIsBiometricSupported(false);
          Alert.alert('Error', 'Biometric authentication is not available');
        }
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setIsBiometricSupported(false);
      Alert.alert('Error', 'Failed to initialize biometric authentication');
    }
  };

  const authenticateUser = async () => {
    if (isVerificationComplete) return;
    
    try {
      const available = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!available || !enrolled) {
        Alert.alert(
          'Authentication Error',
          'Biometric authentication is not available or not set up.',
          [{ text: 'OK' }]
        );
        return;
      }

      const authOptions = {
        promptMessage: Platform.OS === 'ios' 
          ? 'Authenticate with Face ID'
          : `Authenticate with ${biometricType}`,
        disableDeviceFallback: true,
        cancelLabel: "Cancel",
        fallbackLabel: '',
        requireConfirmation: false,
        ...Platform.select({
          android: {
            allowDeviceCredentials: false,
            sensitiveTransaction: true,
          }
        })
      };

      console.log('Starting authentication with options:', authOptions);

      const result = await LocalAuthentication.authenticateAsync(authOptions);
      console.log('Authentication result:', result);
      // console.log(result.success)

      if (result.success) {
        const token = await getToken();
        if (!token) {
            Alert.alert('Error', 'Authentication token missing.');
            return;
        }
        console.log("token"+token)
        const response = await axios.get(
          'http://10.0.8.75:5000/user/checker',
          {
              headers: {
                  'token': token,
              },
          }
      );

      const classData = response.data.clas;
      setClassDetails(classData); // Update classDetails state
      console.log('Class details:', classData);

      const newDetails = {
        coursecode: classDetails.Coursecode,
        hour: classDetails.Hours,
        ispresent: result.success,
      };
      
      console.log(newDetails)

       await axios.post(
        'http://10.0.8.75:5000/user/mark-attendance',
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
          router.push("pages/recorded");
        }, 2000);
      } else if (result.error === 'user_cancel') {
        console.log('User cancelled authentication');
      } else {
        console.log('Authentication failed:', result.error);
        setIsAuthenticated(false);
        Alert.alert(
          'Authentication Failed',
          'Please try again using biometric authentication only.',
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
      <Image 
        source={require("../../assets/images/logo-new-edited.jpg")} 
        style={styles.image} 
        resizeMode="contain" 
      />
      <Text style={styles.title}>
        {Platform.OS === 'ios' ? 'Face ID Authentication' : 'Biometric Authentication'}
      </Text>

      {showRecordedMessage ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✅ Attendance Recorded Successfully!</Text>
          <Text style={styles.redirectText}>Redirecting...</Text>
        </View>
      ) : isBiometricSupported === null ? (
        <Text style={styles.text}>Checking for biometric support...</Text>
      ) : isBiometricSupported ? (
        <View>
          <Text style={styles.text}>
            {Platform.OS === 'ios' 
              ? 'Please authenticate using Face ID'
              : `Please authenticate using your ${biometricType}`}
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={authenticateUser}
          >
            <Text style={styles.buttonText}>
              {Platform.OS === 'ios' ? 'Use Face ID' : 'Authenticate'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.text}>
          {Platform.OS === 'ios' 
            ? "Face ID is not available or not enrolled on this device."
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

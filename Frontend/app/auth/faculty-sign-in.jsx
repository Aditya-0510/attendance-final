import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, Stack } from "expo-router";
import React, { useState } from 'react';
import Color from '../../constant/Color';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function SignIn() {
   const router = useRouter();

   const [email, setEmailAddress] = useState('');
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false); 

   const SignInData = { email, password };
   
   const onSignInPress = async () => {
      setIsLoading(true);

      try {
         const response = await axios.post(`${API_URL}/admin/signin`, SignInData, {});
         Alert.alert(response.data.msg);

         const success = response.data.success;

         if (success) {
            const token = response.data.token;
            const admin = response.data.admin
            
            const storeToken = async (token) => {
               try {
                  await AsyncStorage.setItem('authToken', token);
                  await AsyncStorage.setItem('name', admin.Name);
                  await AsyncStorage.setItem('email', admin.email);
                  console.log('Token stored successfully!');
               } catch (error) {
                  console.error('Error storing token:', error);
               }
            };
               
            await storeToken(token,admin);
            router.replace('(faculty)');
         }
      } catch (error) {
         console.error('Sign-in error:', error);
         Alert.alert('Sign-in Failed', 'Something went wrong. Please try again.');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <>
         <Stack.Screen
            options={{
               headerShown: true,
               animation: "slide_from_right",
            }}
         />
         <View style={styles.container}>
            <Text style={styles.textHeader}>Faculty Sign In</Text>

            <View style={styles.inputContainer}>
               <TextInput 
                  placeholder='Email' 
                  style={styles.textInput} 
                  placeholderTextColor={Color.GRAY} 
                  autoCapitalize='none'
                  value={email}
                  onChangeText={setEmailAddress}
                  editable={!isLoading}
               />
            </View>

            <View style={styles.inputContainer}>
               <TextInput 
                  placeholder='Password' 
                  style={styles.textInput} 
                  secureTextEntry={true} 
                  placeholderTextColor={Color.GRAY} 
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
               />
            </View>

            <TouchableOpacity onPress={() => router.push("/auth/faculty-forgot-password")}>
               <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
               <TouchableOpacity style={[styles.button, isLoading && styles.disabledButton]} onPress={onSignInPress} disabled={isLoading}>
                  {isLoading ? (
                     <ActivityIndicator size="small" color="#fff" />
                  ) : (
                     <Text style={styles.buttonText}>Sign In</Text>
                  )}
               </TouchableOpacity>

               <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/faculty-sign-up")}>
                  <Text style={styles.buttonText}>Sign Up</Text>
               </TouchableOpacity>
            </View>
         </View>
      </>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
   },
   textHeader: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: Color.PRIMARY,
   },
   inputContainer: {
      marginBottom: 15,
   },
   textInput: {
      padding: 12,
      borderWidth: 1,
      borderRadius: 15,
      backgroundColor: '#e6f2ff',
      borderColor: '#cce0ff',
      fontSize: 16,
      color: '#000',
   },
   forgotPasswordText: {
      textAlign: 'center',
      color: 'gray',
      textDecorationLine: 'underline',
      marginBottom: 10,
   },
   buttonContainer: {
      alignItems: 'center',
   },
   button: {
      backgroundColor: Color.PRIMARY,
      paddingVertical: 15,
      borderRadius: 15,
      marginTop: 20,
      alignItems: 'center',
      width: '70%',
   },
   buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
   },
   disabledButton: {
      backgroundColor: '#999',
   },
});

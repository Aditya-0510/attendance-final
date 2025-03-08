import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, Stack } from "expo-router";
import React, { useState,useCallback } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import Color from '../../constant/Color';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn() {
   const router = useRouter();

   const [email, setEmailAddress] = useState('');
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false); // Loading state

   const SignInData = { email, password };

   useFocusEffect(
      useCallback(() => {
        router.setParams({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 15, padding: 10 }}
            >
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
          ),
        });
      }, [])
    );

   const onSignInPress = async () => {
      setIsLoading(true);

      try {
         const response = await axios.post('http://10.0.8.75:5000/user/signin', SignInData);
         Alert.alert(response.data.msg);

         const success = response.data.success;
         console.log(success);

         if (success) {
            const token = response.data.token;

            const storeToken = async (token) => {
               try {
                  await AsyncStorage.setItem('authToken', token);
                  console.log('Token stored successfully!');
               } catch (error) {
                  console.error('Error storing token:', error);
               }
            };

            await storeToken(token);
            router.replace('(tabs)');
         }
      } catch (error) {
         // console.error('Sign-in error:', error);
         Alert.alert('Sign-in Failed', 'Something went wrong. Please try again.'+error);
      } finally {
         setIsLoading(false); // Stop loading
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
            <Text style={styles.textHeader}>Sign In</Text>

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

            <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
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

               <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/sign-up")}>
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
   forgotPasswordText: {
      textAlign: 'center',
      color: 'gray',
      textDecorationLine: 'underline',
      marginBottom: 10,
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
      borderRadius: 25,
      backgroundColor: '#e6f2ff',
      borderColor: '#cce0ff',
      fontSize: 16,
      color: '#000',
   },
   buttonContainer: {
      alignItems: 'center',
   },
   button: {
      backgroundColor: Color.PRIMARY,
      paddingVertical: 15,
      borderRadius: 25,
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
      backgroundColor: '#999', // Greyed out when disabled
   }
});

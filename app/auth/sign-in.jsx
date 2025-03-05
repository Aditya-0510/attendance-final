import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter, Stack } from "expo-router";
import React, { useState } from 'react';
import Color from '../../constant/Color';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn() {
   const router = useRouter();

   const [email, setEmailAddress] = useState('');
   const [password, setPassword] = useState('');

   const SignInData = {email,password}
   
   const onSignInPress = async () => {
      const response = await axios.post('http:10.0.8.75:5000/user/signin', SignInData, {});
      Alert.alert(response.data.msg);

      const success = response.data.success

      console.log(success);
      if(success){
          const token = response.data.token;
          
          const storeToken = async (token,user) => {
              try {
                  await AsyncStorage.setItem('authToken', token);
                  await AsyncStorage.setItem('user', user);
                  console.log('Token stored successfully!');
                } catch (error) {
                    console.error('Error storing token:', error);
                }
            };
            
            storeToken(token,response.data.user);
            router.replace('(tabs)')
        }

   };

   return (
      <>
      <Stack.Screen
        options={{
          headerShown: false,
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
            />
         </View>

         <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onSignInPress}>
               <Text style={styles.buttonText}>Sign In</Text>
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
   googleButton: {
      backgroundColor: 'white',
      paddingVertical: 15,
      borderRadius: 25,
      marginTop: 15,
      borderWidth: 1,
      borderColor: '#ddd',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      width: '70%',
   },
   googleButtonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 10,
   },
   googleIcon: {
      width: 24,
      height: 24,
   },
});
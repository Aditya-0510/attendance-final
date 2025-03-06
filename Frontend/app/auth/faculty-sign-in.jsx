import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter , Stack} from "expo-router";
import React, { useState } from 'react';
import Color from '../../constant/Color';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn() {
   const router = useRouter();

   const [email, setEmailAddress] = useState('');
   const [password, setPassword] = useState('');

   const SignInData = {email,password}
   
   const onSignInPress = async () => {
      const response = await axios.post('http:10.0.8.75:5000/admin/signin', SignInData, {});
      Alert.alert(response.data.msg);

      const success = response.data.success

      if(success){

          const token = response.data.token;
          
          const storeToken = async (token) => {
              try {
                  await AsyncStorage.setItem('authToken', token);
                  console.log('Token stored successfully!');
                } catch (error) {
                    console.error('Error storing token:', error);
                }
            };
            
            storeToken(token);
            router.replace('(faculty)')
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
         <Text style={styles.textHeader}>Faculty Sign In</Text>

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

            <TouchableOpacity style={styles.button} onPress={()=>router.push("/auth/faculty-sign-up")}>
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
   }
});

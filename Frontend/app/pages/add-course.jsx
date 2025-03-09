import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'
import Header from "../../components/Fheader"; 
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function AddCourse() {
      const router = useRouter()

    const [coursecode, setCourseId] = useState('');
    const [title, setTitle] = useState('');

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            return token;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    };

    const addCourse = async () => {
        const classDetails = { coursecode, title };

        try {
            const token = await getToken();
            if (!token) {
                Alert.alert('Error', 'Authentication token missing.');
                return;
            }
            
            console.log("hhfhfh")
            const response = await axios.post(
                `${API_URL}/admin/add-course`,
                classDetails,
                {
                    headers: {
                        'token': token,
                    },
                }
            );

            Alert.alert('Success', response.data.msg);
            setCourseId('');
            setTitle('');
            router.push("pages/faculty-courses");
        } catch (error) {
            console.error('Error adding course:', error);
            Alert.alert('Error', 'Failed to add course.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Adding a Course</Text>
            <TextInput
                style={styles.input}
                placeholder="Course ID"
                value={coursecode}
                onChangeText={setCourseId}
            />
            <TextInput
                style={styles.input}
                placeholder="Course Title"
                value={title}
                onChangeText={setTitle}
            />
            <TouchableOpacity style={styles.button} onPress={addCourse}>
                <Text style={styles.buttonText}>Add Course</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CourseList() {
    const [courseList, setCourseList] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            return token;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    };

    const fetchCourses = async () => {
        try {
            const token = await getToken();
            if (!token) {
                Alert.alert('Error', 'Authentication token missing.');
                return;
            }

            const response = await axios.get('http://localhost:5000/admin/courses', {
                headers: {
                    'token': token,
                },
            });

            if (response.data.isThere) {
                setCourseList(response.data.courses);
            } else {
                setCourseList([]);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            Alert.alert('Error', 'Failed to fetch courses.');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={courseList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.courseItem}
                        onPress={()=>router.push("pages/courseAttendance")}
                    >
                        <Text style={styles.courseText}>{item.title}</Text>
                        <Text style={styles.courseText}>{item.coursecode}</Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("pages/add-course")}>
                <Text style={styles.addButtonText}>+</Text>
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
    },
    courseItem: {
        backgroundColor: '#80B3FF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginVertical: 5,
        width: '80%',
        alignItems: 'center',
    },
    courseText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    addButton: {
        marginTop: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    addButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    }
});

import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from "expo-router";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
    const router = useRouter();
    const [username, setUsername] = useState("Guest");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getToken = async () => {
        try {
            return await AsyncStorage.getItem('authToken');
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    };

    const fetchUserData = async () => {
        try {
            const token = await getToken();
            if (!token) {
                Alert.alert('Error', 'Authentication token missing.');
                return;
            }

            const response = await axios.get("http://10.0.8.75:5000/admin/profile", {
                headers: { token }
            });

            if (response.data) {
                setUsername(response.data.Name || "Guest");
            } else {
                console.warn("Empty response from server.");
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            Alert.alert("Error", "Failed to load user details.");
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchClassDetails = async () => {
        setLoading(true);
        setError(null); // Reset error before making a request
        try {
            const token = await getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.get("http://10.0.8.75:5000/admin/checker", {
                headers: { 'token': token },
            });

            console.log(response.data);

            if (response.data?.ongoing) {
                Alert.alert("Class in Progress", "A class is currently going on. You cannot create a new class.");
            } else {
                router.push("pages/start-class");
            }
        } catch (err) {
            console.error('Error fetching class details:', err);
            setError(err.response?.data?.message || "Failed to fetch class details");
            Alert.alert("Error", "Failed to fetch class details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>Welcome, {username}!</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={fetchClassDetails} disabled={loading}>
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Start a class</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => router.push("pages/current-class")}>
                        <Text style={styles.buttonText}>Current class</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => router.push("pages/course-select-report")}>
                        <Text style={styles.buttonText}>Attendance Report</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => router.push("pages/faculty-courses")}>
                        <Text style={styles.buttonText}>Your Courses</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        color: "#1E73E8",
        marginBottom: 20,
        textTransform: "capitalize",
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    button: {
        width: '100%',
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

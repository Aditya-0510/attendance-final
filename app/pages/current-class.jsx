import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import Header from "../../components/Fheader"; 
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function CurrentClass() {
    const [classDetails, setClassDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const response = await axios.get(`YOUR_BACKEND_ENDPOINT/current-class`,{
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setClassDetails(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch class details");
                Alert.alert("Error", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchClassDetails();
        }
    }, [courseId]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Header />
                <ActivityIndicator size="large" color="#007bff" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <Header />
                <Text style={styles.errorText}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Class is in Progress !!</Text>
                <View style={styles.detailContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Course Name</Text>
                        <Text style={styles.value}>{classDetails.courseName}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Date</Text>
                        <Text style={styles.value}>{new Date(classDetails.date).toLocaleDateString()}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Hours</Text>
                        <Text style={styles.value}>{classDetails.hours}</Text>
                    </View>

                    <TouchableOpacity 
                        style={[styles.courseCard]}>
                            <Text style={styles.courseName}>Stop class</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30
    },
    detailContainer: {
        backgroundColor: '#f4f4f4',
        borderRadius: 10,
        padding: 20
    },
    courseCard: {
        width: "90%", // Adjust width as needed
        alignSelf: "center", // Center the card
        backgroundColor: "#7DA3C3",
        padding: 15,
        marginVertical: 5,
        borderRadius: 5, // Less rounded corners for boxy look
        borderWidth: 2, // Add a border
        borderColor: "#00509E", // Darker border for contrast
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5, // For Android shadow
      },
      courseName: {
        fontSize: 18,
        fontWeight: "bold",
      },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    label: {
        fontSize: 16,
        color: '#666'
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20
    }
});

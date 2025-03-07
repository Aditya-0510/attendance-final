import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter,useLocalSearchParams } from "expo-router";
import Header from "../../components/Fheader";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CurrentClass() {
    const router = useRouter();
    const [classDetails, setClassDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { batch,title } = useLocalSearchParams();

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) throw new Error('Authentication token not found');
            return token;
        } catch (err) {
            console.error('Error retrieving token:', err);
            Alert.alert('Error', err.message);
            return null;
        }
    };

    const fetchClassDetails = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            if (!token) return;

            const response = await axios.get("http://10.0.8.75:5000/admin/checker", {
                headers: { 'token': token },
            });

            if (response.data.ongoing) {
                setClassDetails(response.data.clas);
            } else {
                setClassDetails(null);
            }
        } catch (err) {
            console.error('Error fetching class details:', err);
            setError(err.response?.data?.message || "Failed to fetch class details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassDetails();
    }, []);

    const handleStopClass = async () => {
        try {
            const token = await getToken();
            if (!token) return;

            const response = await axios.delete("http://10.0.8.75:5000/admin/end-class", {
                headers: { 'token': token },
            });

            Alert.alert('Class Stopped', response.data.msg);
            router.push({
                pathname: "/pages/today-attendance",
                params: { batch: batch,title,title},
             });
        } catch (err) {
            console.error('Error stopping class:', err);
            Alert.alert('Error', err.response?.data?.message || "Failed to stop the class");
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Header />
                <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
            </SafeAreaView>
        );
    }

    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : classDetails ? (
                    <>
                        <Text style={styles.title}>Class is in Progress !!</Text>
                        <View style={styles.detailContainer}>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Course:</Text>
                                <Text style={styles.value}>{classDetails.Title || "N/A"}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Date:</Text>
                                <Text style={styles.value}>{new Date(classDetails.date).toLocaleDateString() || "N/A"}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Hours:</Text>
                                <Text style={styles.value}>{classDetails.Hours || "N/A"}</Text>
                            </View>

                            <TouchableOpacity onPress={handleStopClass} style={styles.courseCard}>
                                <Text style={styles.courseName}>Stop Class</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <Text style={styles.noClassText}>No ongoing class at the moment.</Text>
                )}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    loader: {
        marginTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    detailContainer: {
        backgroundColor: '#f4f4f4',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    courseCard: {
        backgroundColor: '#7DA3C3',
        padding: 15,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 20,
        width: '90%',
        borderWidth: 1,
        borderColor: '#00509E',
    },
    courseName: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#555',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    noClassText: {
        fontSize: 18,
        color: '#777',
        textAlign: 'center',
        marginTop: 50,
    },
});

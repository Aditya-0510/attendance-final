import React, { useState, useEffect } from 'react';
import { StyleSheet,Text,View,TouchableOpacity,Modal,FlatList,SafeAreaView,Alert,ActivityIndicator } from 'react-native';
import Header from "../../components/header"; 
import { useRouter } from "expo-router";
import axios from 'axios';

export default function ClassDetails() {
    const router = useRouter();
    const [courseModalVisible, setCourseModalVisible] = useState(false);
    const [hoursModalVisible, setHoursModalVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({
        name: 'Select Course',
        id: null
    });
    const [selectedHours, setSelectedHours] = useState('No. of Hours');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const hours = ['1 - Tutorial', '1.5 - Class', '2 - Lab'];

    // Fetch courses from backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://10.0.8.75:5000/admin/courses');
                setCourses(response.data.courses);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleStartClass = async () => {
        if (selectedCourse.name === 'Select Course' || selectedHours === 'No. of Hours') {
            Alert.alert("Incomplete Selection", "Please select a course and hours before starting the class");
            return;
        }

        try {
            const classData = {
                courseId: selectedCourse.id,
                courseName: selectedCourse.name,
                hours: selectedHours,
                date: new Date().toISOString()
            };

            const response = await axios.post('http://10.0.8.75:5000/admin/start-class', classData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.success) {
                router.push({
                    pathname: "/faculty/current-class",
                    params: {
                        courseId: selectedCourse.id,
                        courseName: selectedCourse.name,
                        hours: selectedHours
                    }
                });
            } else {
                Alert.alert("Start Class Failed", response.data.message || "Unable to start class");
            }
        } catch (error) {
            console.error('Start Class Error:', error);
            Alert.alert("Error", error.response?.data?.message || "Network error. Please try again.");
        }
    };

    const renderCourseItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.modalItem}
            onPress={() => {
                setSelectedCourse({ id: item.id, name: item.name });
                setCourseModalVisible(false);
            }}
        >
            <Text style={styles.modalItemText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderHoursItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.modalItem}
            onPress={() => {
                setSelectedHours(item);
                setHoursModalVisible(false);
            }}
        >
            <Text style={styles.modalItemText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <>
        <Header/>
        
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Class Details</Text>

            {/* Course Dropdown */}
            <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setCourseModalVisible(true)}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#000" />
                ) : (
                    <Text style={styles.dropdownText}>{selectedCourse.name}</Text>
                )}
                <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            {/* Hours Dropdown */}
            <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setHoursModalVisible(true)}
            >
                <Text style={styles.dropdownText}>{selectedHours}</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            {/* Start Button */}
            <TouchableOpacity 
                style={styles.startButton}
                onPress={handleStartClass}
            >
                <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>

            {/* Course Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={courseModalVisible}
                onRequestClose={() => setCourseModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {error ? (
                            <Text style={{ textAlign: 'center', color: 'red' }}>{error}</Text>
                        ) : (
                            <FlatList
                                data={courses}
                                renderItem={renderCourseItem}
                                keyExtractor={(item) => item.id}
                            />
                        )}
                    </View>
                </View>
            </Modal>

            {/* Hours Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={hoursModalVisible}
                onRequestClose={() => setHoursModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={hours}
                            renderItem={renderHoursItem}
                            keyExtractor={(item) => item}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },
  dropdownText: {
    fontSize: 16,
    color: '#333'
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#888'
  },
  startButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    maxHeight: 300
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalItemText: {
    fontSize: 16
  }
});

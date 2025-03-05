import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  SafeAreaView,
  Alert  
} from 'react-native';
import Header from "../../components/header"; 
import { useRouter} from "expo-router";
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

    const courses = [
        { id: 'SE001', name: 'Software Engineering' },
        { id: 'DBMS002', name: 'Database Management System' },
        { id: 'OS003', name: 'Operating Systems' },
        { id: 'TOC004', name: 'Theory of Computation' },
        { id: 'LA005', name: 'Linear Algebra' },
        { id: 'ETH006', name: 'Ethics' }
    ];

    const hours = ['1 - Tutorial', '1.5 - Class', '2 - Lab'];

    const handleStartClass = async () => {
        // Validate selections
        if (selectedCourse.name === 'Select Course' || selectedHours === 'No. of Hours') {
            Alert.alert(
                "Incomplete Selection",
                "Please select a course and hours before starting the class"
            );
            return;
        }

        try {
            // Prepare data to send to backend
            const classData = {
                courseId: selectedCourse.id,
                courseName: selectedCourse.name,
                hours: selectedHours,
                date: new Date().toISOString()
            };
    
            // Send data to backend
            const response = await axios.post('YOUR_BACKEND_ENDPOINT/start-class', classData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                // Navigate to current class screen
                router.push({
                    pathname: "/faculty/current-class",
                    params: {
                        courseId: selectedCourse.id,
                        courseName: selectedCourse.name,
                        hours: selectedHours
                    }
                });
            } else {
                // Handle any specific error from backend
                Alert.alert(
                    "Start Class Failed",
                    response.data.message || "Unable to start class"
                );
            }
        } catch (error) {
            // Handle network or axios errors
            console.error('Start Class Error:', error);
            Alert.alert(
                "Error",
                error.response?.data?.message || "Network error. Please try again."
            );
        }
    };

    const renderCourseItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.modalItem}
            onPress={() => {
                setSelectedCourse({
                    id: item.id,
                    name: item.name
                });
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
      >
        <Text style={styles.dropdownText}>{selectedCourse.name}</Text>
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
        // onPress={() => {
        //     // Check if both course and hours are selected
        //     if (selectedCourse !== 'Select Course' && selectedHours !== 'No. of Hours') {
        //       router.push({
        //         pathname: "/faculty/current-class",
        //         params: {
        //           courseName: selectedCourse,
        //           hours: selectedHours
        //         }
        //       });
        //     } else {
        //       // Optional: Add an alert or toast to inform user to select course and hours
        //       Alert.alert(
        //         "Selection Required", 
        //         "Please select a course and hours before starting the class"
        //       );
        //     }
        //   }}
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
            <FlatList
              data={courses}
              renderItem={renderCourseItem}
              keyExtractor={(item) => item.id}
            />
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
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import Header from "../../components/Fheader";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter,useLocalSearchParams } from "expo-router";
import axios from 'axios';

export default function ClassDetails() {

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const router = useRouter();
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [hoursModalVisible, setHoursModalVisible] = useState(false);
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({
    name: 'Select Course',
  });
  const [selectedHours, setSelectedHours] = useState('No. of Hours');
  const [selectedBatch, setBatch] = useState('Batch');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hours = ['1 - Tutorial', '1.5 - Class', '2 - Lab'];
  const batch = ['CSE', 'ECE', 'DSAI'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await getToken();
        if (!token) {
          Alert.alert('Error', 'Authentication token missing.');
          return;
        }
        const response = await axios.get('http://10.0.8.75:5000/admin/courses', {
          headers: { "token": token }
        });
  
        // console.log('API Response:', response.data.courses); // Check what's coming from the API
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
    if (selectedCourse.id === 'N/A' || selectedHours === 'No. of Hours' || selectedBatch === 'Batch') {
      Alert.alert("Incomplete Selection", "Please select a course, batch, and hours before starting the class");
      return;
    }
    
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Authentication token missing.');
        return;
      }
  
      const classData = {
        coursecode: selectedCourse.id, // Correct coursecode for API
        title : selectedCourse.name,
        batch: selectedBatch,
        hours: selectedHours.split(' ')[0], // Extract just the hours (e.g., "1" from "1 - Tutorial")
      };
  
      console.log('Sending class data:', classData);
  
      const response = await axios.post('http://10.0.8.75:5000/admin/start-class', classData, {
        headers: { 'token': token }
      });
      console.log(response.data);
      if (response.data.success) {
        Alert.alert(response.data.msg)
        router.push({
          pathname: "/pages/current-class",
          params: { batch: selectedBatch,title:selectedCourse.title},
       });
       
      } else {
        Alert.alert("Start Class Failed", response.data.message || "Unable to start class");
      }
    } catch (error) {
      console.error('Start Class Error:', error);
      Alert.alert("Error", error.response?.data?.message || "Network error. Please try again.");
    }
  };
  

  const renderCourseItem = ({ item }) => {
    console.log('Course item clicked:', item); // Debug log
    return (
      <TouchableOpacity
        style={styles.modalItem}
        onPress={() => {
          setSelectedCourse({
            name: `${item.coursecode || 'N/A'} - ${item.title || 'N/A'}`,
            id: item.coursecode || 'N/A' // Ensure coursecode is set for API call
          });
          setCourseModalVisible(false);
        }}
      >
        <Text style={styles.modalItemText}>
          {item.coursecode || 'N/A'} - {item.title || 'N/A'}
        </Text>
      </TouchableOpacity>
    );
  };
  
  

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

  const renderBatchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setBatch(item);
        setBatchModalVisible(false);
      }}
    >
      <Text style={styles.modalItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Header />

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

        {/* Batch Dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setBatchModalVisible(true)}
        >
          <Text style={styles.dropdownText}>{selectedBatch}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartClass}
        >
          <Text style={styles.startButtonText}>Start </Text>
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
                  keyExtractor={(item) => item._id}
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

        {/* Batch Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={batchModalVisible}
          onRequestClose={() => setBatchModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={batch}
                renderItem={renderBatchItem}
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },
  dropdownText: {
    fontSize: 16
  },
  dropdownIcon: {
    fontSize: 12
  },
  startButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center'
  },
  startButtonText: {
    color: 'white',
    fontSize: 18
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1
  },
  modalItemText: {
    fontSize: 16
  }
});

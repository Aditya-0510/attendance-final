import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Papa from "papaparse";
import Header from "../../components/Fheader";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const {title } = useLocalSearchParams();
  const [batch, setBatch] = useState(null);
  // console.log(coursecode);

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  const getStoredData = async () => {
    try {
      const storedBatch = await AsyncStorage.getItem("selectedBatch");
      console.log("storedbatch"+storedBatch);
      setBatch(storedBatch);
    } catch (error) {
      console.error("Error retrieving stored data:", error);
    }
  };

  useEffect(()=>{
    getStoredData()
  },[])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) {
          Alert.alert("Error", "Authentication token missing.");
          setLoading(false);
          return;
        }

        console.log(batch);
        const response = await axios.get(
          `${API_URL}/admin/present`,
          {
            headers: { 'token': token },
            params: { 'batch': batch},
          }
        );

        console.log(response.data);

        // Ensure response.data is always an array
        if (response.data) {
          setStudents(response.data);
        } else {
          setStudents([]); // Set empty array if no data
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]); // Ensure students is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [batch]);

  const exportToCSV = async () => {
    if (students.length === 0) {
      Alert.alert("No Data", "There is no data to export.");
      return;
    }

    // Convert student data to CSV format
    const csvData = Papa.unparse(
      students.map((student) => ({
        "Roll Number": student.rollno,
        Attendance: student.attendance,
      }))
    );

    const filePath = FileSystem.cacheDirectory + "StudentData.csv";

    try {
      await FileSystem.writeAsStringAsync(filePath, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
      } else {
        Alert.alert(
          "Sharing Not Available",
          "Unable to share file on this device."
        );
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      Alert.alert("Error", "Failed to export data.");
    }
  };

  return (
    
      
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Student Performance for {title}</Text>

        <TouchableOpacity style={styles.exportButton} onPress={exportToCSV}>
          <Text style={styles.exportButtonText}>Export to CSV</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : students.length === 0 ? (
          <Text style={styles.noDataText}>No students found.</Text>
        ) : (
          <View>
            <View style={styles.table}>
              <View style={[styles.row, styles.header]}>
                <Text style={[styles.cell, styles.headerText]}>
                  Roll Number
                </Text>
                <Text style={[styles.cell, styles.headerText]}>Attendance</Text>
              </View>

              <FlatList
                data={students}
                keyExtractor={(item) => item.rollno.toString()}
                renderItem={({ item }) => (
                  <View style={styles.row}>
                    <Text style={styles.cell}>{item.rollno}</Text>
                    <Text style={styles.cell}>{item.attendance}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop:20,
    marginBottom: 15,
  },
  noDataText: {
    fontSize: 18,
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
  },
  header: {
    backgroundColor: "#007bff",
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 10,
    fontSize: 16,
  },
  exportButton: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 20, // Adjusted spacing
    marginTop:10,
  },
  exportButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

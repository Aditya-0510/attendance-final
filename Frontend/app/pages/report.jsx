import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
// import XLSX from "xlsx";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { coursecode, title } = useLocalSearchParams();
  // console.log(coursecode);

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) {
          Alert.alert('Error', 'Authentication token missing.');
          setLoading(false);
          return;
        }

        const response = await axios.get("http://10.0.8.75:5000/admin/get-all", {
          headers: { 'token': token },
          params: { coursecode: coursecode },
        });

        console.log(response.data)

        // Ensure response.data is always an array
        if (response.data && Array.isArray(response.data)) {
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
  }, []);

  // const exportToExcel = async () => {
  //   if (students.length === 0) {
  //     Alert.alert("No Data", "There is no data to export.");
  //     return;
  //   }

  //   let dataToExport = students.map(student => ({
  //     "Roll Number": student.rollNumber,
  //     "Percentage": student.percentage
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  //   const excelFile = XLSX.write(workbook, { type: "base64" });
  //   const filePath = FileSystem.cacheDirectory + "StudentData.xlsx";

  //   await FileSystem.writeAsStringAsync(filePath, excelFile, {
  //     encoding: FileSystem.EncodingType.Base64
  //   });

  //   if (await Sharing.isAvailableAsync()) {
  //     await Sharing.shareAsync(filePath);
  //   } else {
  //     Alert.alert("Sharing Not Available", "Unable to share file on this device.");
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Student Performance for {title}</Text>

      {/* Export Button */}
      {/* <TouchableOpacity style={styles.exportButton} onPress={exportToExcel}>
        <Text style={styles.exportButtonText}>Export to Excel</Text>
      </TouchableOpacity> */}

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : students.length === 0 ? (
        <Text style={styles.noDataText}>No students found.</Text>
      ) : (
        <View>
          <View style={styles.table}>
            <View style={[styles.row, styles.header]}>
              <Text style={[styles.cell, styles.headerText]}>Roll Number</Text>
              <Text style={[styles.cell, styles.headerText]}>Percentage</Text>
            </View>

            <FlatList
              data={students}
              keyExtractor={(item) => item.rollno.toString()}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.cell}>{item.rollno}</Text>
                  <Text style={styles.cell}>{item.percentage.toFixed(2)}%</Text>
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
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15
  },
  noDataText: {
    fontSize: 18,
    textAlign: "center",
    color: "gray",
    marginTop: 20
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden"
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    backgroundColor: "#f9f9f9"
  },
  header: {
    backgroundColor: "#007bff"
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold"
  },
  cell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 10,
    fontSize: 16
  },
  exportButton: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 20 // Adjusted spacing
  },
  exportButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  }
});

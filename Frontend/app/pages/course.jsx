import { StyleSheet, Text, View ,TouchableOpacity,FlatList} from 'react-native'
import React from 'react'
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons"; // Import Icon for Back Button
import Header from "../../components/header"; 


export default function course() {
  const router = useRouter();

  const courses = [
    { id: "1", name: "Course Name", professor: "Prof. Name" },
    { id: "2", name: "Course Name", professor: "Prof. Name" },
    { id: "3", name: "Course Name", professor: "Prof. Name" },
    { id: "4", name: "Course Name", professor: "Prof. Name" },
    { id: "5", name: "Course Name", professor: "Prof. Name" },
  ];
  return (
    <View>
      <Header/>
      {/* <TouchableOpacity
  style={styles.backButton}
  onPress={() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/"); // Fallback to home if no history
    }
  }}
>
  <FontAwesome name="arrow-left" size={24} color="black" />
</TouchableOpacity> */}

<View style={styles.flatListContainer}>
  <FlatList
    data={courses}
    keyExtractor={(item) => item.id}
    renderItem={({ item, index }) => (
      <TouchableOpacity 
        style={[styles.courseCard]}
        onPress={()=>router.push("pages/courseAttendance")}
      >
        <Text style={styles.courseName}>{item.name}</Text>
        <Text style={styles.professorName}>{item.professor}</Text>
      </TouchableOpacity>
    )}
  />
</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  backButton: {
    position: "absolute",
    top: 25, // Adjust for better visibility
    left: 20,
    // backgroundColor: "#1E73E8",
    padding: 10,
    borderRadius: 10, // Makes it circular
    elevation: 5,
    zIndex: 10, // Ensures it stays above everything
  },
  flatListContainer: {
    marginTop: 40, // Adjust this value as needed
  },
  
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
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
  
  
  selectedCard: {
    borderWidth: 3,
    borderColor: "#0066FF",
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  professorName: {
    fontSize: 14,
  },
});
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'
import Header from "../../components/header";
import { useRouter } from "expo-router";

export default function notification() {
    const router = useRouter();
  return (
    <>
    <Header/>
    <TouchableOpacity 
      style={styles.card}
      onPress={()=>router.push("pages/location")}
    >
      <Text style={styles.header}>Class Started - 1.5 Hrs</Text>
      <Text style={styles.course}>➜ Software Engineering</Text>
      <Text style={styles.professor}>by Dr. Vivekraj V K</Text>
    </TouchableOpacity>

    </>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2196F3", // Blue background
    padding: 15,
    borderRadius: 15,
    width: "80%", // Adjust width
    marginTop: 60,
    marginLeft: 25,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "black",
  },
  course: {
    fontSize: 18,
    marginTop: 5,
    color: "black",
  },
  professor: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 5,
    color: "black",
  }
});
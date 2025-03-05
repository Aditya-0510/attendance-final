import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from "../../components/Fheader"; 
import { useRouter} from "expo-router";

export default function Index() {
    const router = useRouter();
  return (
    <>
      <View style={styles.container}>
        <Header />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={()=>router.push("pages/start-class")}>
            <Text style={styles.buttonText}>Start a class</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={()=>router.push("pages/current-class")}>
            <Text style={styles.buttonText}>Current class</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={()=>router.push("pages/report")}>
            <Text style={styles.buttonText}>Attendance Report</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress = {()=>router.push("pages/faculty-courses")}>
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
})
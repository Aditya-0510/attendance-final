import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function index() {
    const router = useRouter();
    const [username, setUsername] = useState("Guest");
    
    // Animation values
    const pulseValue = useRef(new Animated.Value(1)).current;
    const moveValue = useRef(new Animated.Value(0)).current;
    
    // Create animations
    useEffect(() => {
      // Pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();
      
      // Moving animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(moveValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(moveValue, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();
    }, []);
    
    // Interpolate animations
    const moveX = moveValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-10, 10]
    });

    const getUser = async () => {
      try {
        return await AsyncStorage.getItem('name');
      } catch (error) {
        console.error('Error retrieving user details:', error);
        return null;
      }
    };
    
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const user = await getUser();
          if (user) {
            setUsername(user);
          } else {
            console.log('User not found, using default Guest');
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      
      fetchUserData();
    }, []);

  return (
    <>
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
          <View style={styles.container1}>
            {/* Creative education-themed graphic using standard components */}
            <View style={styles.creativeContainer}>
              <View style={styles.graphicBackground}>
                {/* Circular background */}
                <View style={styles.circleOuter}>
                  <View style={styles.circleInner} />
                </View>
                
                {/* Animated book icon */}
                <Animated.View style={[
                  styles.iconCenter,
                  { transform: [{ scale: pulseValue }] }
                ]}>
                  <FontAwesome5 name="book" size={42} color="#1E73E8" />
                </Animated.View>
                
                {/* Moving cloud icon */}
                <Animated.View style={[
                  styles.cloudIcon,
                  { transform: [{ translateX: moveX }] }
                ]}>
                  <Ionicons name="cloud" size={32} color="#87CEEB" />
                </Animated.View>
                
                {/* Knowledge icons */}
                <View style={styles.iconRow}>
                  <View style={styles.iconBox}>
                    <MaterialIcons name="lightbulb" size={28} color="#FFD700" />
                  </View>
                  <View style={styles.iconBox}>
                    <MaterialIcons name="computer" size={28} color="#1E73E8" />
                  </View>
                  <View style={styles.iconBox}>
                    <MaterialIcons name="school" size={28} color="#4CAF50" />
                  </View>
                </View>
                
                <Text style={styles.eduText}>Hey There!</Text>
              </View>
            </View>

            <View style={styles.buttonContainer1}>
              <TouchableOpacity 
                style={styles.button1}
                onPress={()=>router.push("user-pages/user-ongoing")}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="class" size={22} color="black" />
                </View>
                <Text style={styles.buttonText1}>Current Class</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.button1}
                onPress={()=>router.push("user-pages/course")}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="analytics" size={22} color="black" />
                </View>
                <Text style={styles.buttonText1}>Course Analytics</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> 
        </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F7FA",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E73E8",
    marginBottom: 15,
    textTransform: "capitalize",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    letterSpacing: 0.5,
  },
  creativeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    height: 200,
  },
  graphicBackground: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: 220,
    height: 200,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    position: "relative",
  },
  circleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E6F0FF",
    borderWidth: 2,
    borderColor: "#1E73E8",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 20,
  },
  circleInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: "#5C9DFF",
    borderStyle: "dashed",
  },
  iconCenter: {
    position: "absolute",
    top: 60,
    zIndex: 2,
  },
  cloudIcon: {
    position: "absolute",
    top: 20,
    right: 40,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 80,
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eduText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "600",
    color: "#1E73E8",
    letterSpacing: 1,
  },
  container1: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
    width: "100%",
  },
  buttonContainer1: {
    width: "100%",
    alignItems: "center",
    gap: 15,
    marginTop: 8,
  },
  button1: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttonText1: {
    fontSize: 15,
    fontWeight: "600",
    color: "black",
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 30,
    alignItems: "center",
    marginRight: 10,
  }
});
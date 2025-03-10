import { StyleSheet, Text, View, TouchableOpacity, Alert, Animated, Easing } from "react-native";
import { useRouter, Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';
import axios from 'axios';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function Attendance() {
  const router = useRouter();
  const { coursecode, title } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Authentication token missing.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/user/total-attendance`, {
        headers: { token: token },
        params: { Coursecode: coursecode },
      });

      if (response.data && response.data.length > 0) {
        setData(response.data[0]); // Access the first item in the array
        // Animate the circular progress
        Animated.timing(animatedValue, {
          toValue: response.data[0].percentage / 100,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false
        }).start();
      } else {
        setData(null);
      }
    } catch (error) {
      setData(null);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Custom Circular Progress Component using View instead of SVG
  const CircularProgressComponent = ({ percentage }) => {
    const circleSize = 180;
    const displayedPercentage = Math.round(percentage);
    
    // Calculate the rotation angle for the progress arc
    const progressAngle = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
      <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 15}}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("user-pages/notification")}
              style={{ marginRight: 15}}
            >
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.circularProgressContainer}>
        {/* Create the static red background circle */}
        <View style={[styles.circle, { width: circleSize, height: circleSize }]}>
          <View style={[styles.progressBackground, { borderColor: '#F44336' }]} />
          
          {/* Animated green progress arc */}
          <Animated.View 
            style={[
              styles.progressOverlay,
              {
                borderColor: '#4CAF50',
                transform: [
                  { rotate: '-90deg' }, // Start from the top
                  { rotateZ: progressAngle }
                ]
              }
            ]} 
          />
          
          {/* Animated progress indicator dot */}
          <Animated.View 
            style={[
              styles.progressIndicator,
              {
                transform: [
                  { rotate: progressAngle },
                  { translateX: circleSize / 2 - 10 }
                ]
              }
            ]} 
          />
          
          {/* Inner white circle with percentage text */}
          <View style={[styles.innerCircle, { width: circleSize - 40, height: circleSize - 40 }]}>
            <Text style={styles.percentageText}>{displayedPercentage}%</Text>
          </View>
        </View>
      </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading attendance data...</Text>
      ) : data && data.totalhours > 0 ? (
        <>
          <CircularProgressComponent percentage={data.percentage} />
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Attended </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendText}>Missed </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>No. of hours conducted: {data.totalhours}</Text>
            <Text style={styles.infoText}>No. of hours attended: {data.attendedHours}</Text>
            <Text style={styles.infoText}>No. of hours missed: {data.totalhours - data.attendedHours}</Text>
            <Text style={styles.infoText}>Percentage: {data.percentage.toFixed(2)}%</Text>
          </View>
        </>
      ) : (
        <View style={styles.noClassContainer}>
          <FontAwesome name="calendar-o" size={60} color="#CCCCCC" />
          <Text style={styles.noClassText}>No class has been started yet</Text>
          <Text style={styles.noClassSubtext}>Check back later for attendance data</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 20,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    marginTop: 80,
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 20,
  },
  circularProgressContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 20,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 20,
    borderColor: '#F44336', // Missed color (red)
  },
  progressOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 20,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4CAF50', // Attended color (green)
    transform: [{ rotate: '-90deg' }],
  },
  progressIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -10,
  },
  innerCircle: {
    backgroundColor: 'white',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 45
  },
  infoText: {
    color: "#000000",
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
  noClassContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noClassText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
  },
  noClassSubtext: {
    fontSize: 14,
    color: "#666666",
    marginTop: 10,
    textAlign: "center",
  }
});
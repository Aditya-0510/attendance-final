import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter, Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';
import axios from 'axios';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function Attendance() {
  const router = useRouter();
  const { coursecode, title } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } else {
        setData(null);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setData(null);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Simple Pie Chart Component
  const PieChart = ({ percentage }) => {
    const circleSize = 180;
    const displayedPercentage = Math.round(percentage);
    
    // Calculate angle in degrees for the attended portion (green)
    const attendedAngle = 3.6 * percentage; // 3.6 = 360/100
    
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
      <View style={styles.pieChartContainer}>
        <View style={[styles.pieChart, { width: circleSize, height: circleSize }]}>
          {/* Missed portion (red) - full circle by default */}
          <View style={[styles.pieSlice, { backgroundColor: '#F44336' }]} />
          
          {/* Attended portion (green) - overlays based on percentage */}
          <View 
            style={[
              styles.pieSlice, 
              { 
                backgroundColor: '#4CAF50',
                // Create a conical gradient effect using a rotated element with overflow
                transform: [
                  { rotate: `${attendedAngle}deg` }
                ],
                // Hide the overflow portion using a clipping mask
                borderTopRightRadius: percentage >= 50 ? 0 : circleSize,
                borderBottomRightRadius: percentage >= 50 ? 0 : circleSize,
                // Only show right half of the circle
                right: percentage <= 50 ? '50%' : 0,
                width: percentage <= 50 ? '50%' : '100%',
              }
            ]} 
          />
          
          {/* If percentage > 50%, we need a second green piece for the left half */}
          {percentage > 50 && (
            <View 
              style={[
                styles.pieSlice, 
                { 
                  backgroundColor: '#4CAF50',
                  // For the left half, we rotate it differently
                  transform: [
                    { rotate: `${attendedAngle - 180}deg` }
                  ],
                  // Only show left half
                  left: '50%',
                  width: '50%',
                  // Clip as needed
                  borderTopLeftRadius: circleSize,
                  borderBottomLeftRadius: circleSize,
                }
              ]} 
            />
          )}
          
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
          <PieChart percentage={data.percentage} />
          
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
  pieChartContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 20,
  },
  pieChart: {
    position: 'relative',
    borderRadius: 1000,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieSlice: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  innerCircle: {
    backgroundColor: 'white',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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
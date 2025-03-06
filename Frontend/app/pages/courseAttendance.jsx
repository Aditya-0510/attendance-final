import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Header from "../../components/header";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Svg, { G, Circle } from 'react-native-svg';

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

      const response = await axios.get('http://10.0.8.75:5000/user/total-attendance', {
        headers: { token: token },
        params: { Coursecode: coursecode },
      });

      if (response.data && response.data.length > 0) {
        setData(response.data[0]); // Access the first item in the array
      } else {
       setData(null)
      }
    } catch (error) {
      // console.error('Error fetching attendance:', error);
      setData(null);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Custom Pie Chart Component
  const PieChartComponent = ({ percentage }) => {
    const radius = 70;
    const circleCircumference = 2 * Math.PI * radius;
    
    const attendedPercentage = percentage;
    const missedPercentage = 100 - percentage;
    
    const attendedStrokeDashoffset = circleCircumference - (circleCircumference * attendedPercentage) / 100;
    const missedStrokeDashoffset = circleCircumference - (circleCircumference * missedPercentage) / 100;
    
    return (
      <View style={styles.pieChartContainer}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${radius * 2 + 20} ${radius * 2 + 20}`}>
          <G rotation="-90" origin={`${radius + 10}, ${radius + 10}`}>
            {/* Background Circle */}
            <Circle
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              stroke="#F44336"
              strokeWidth="20"
              fill="transparent"
            />
            {/* Foreground Circle */}
            <Circle
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              stroke="#4CAF50"
              strokeWidth="20"
              fill="transparent"
              strokeDasharray={circleCircumference}
              strokeDashoffset={attendedStrokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>{title}</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading attendance data...</Text>
      ) : data && data.totalhours > 0 ? (
        <>
          <PieChartComponent percentage={data.percentage} />
          
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
    width: 180,
    height: 180,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 20,
  },
  percentageContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
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
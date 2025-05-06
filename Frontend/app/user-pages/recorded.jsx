// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useRouter,Stack} from "expo-router";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Header from "../../components/header";
// import Constants from 'expo-constants';

// const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

// export default function Recorded() {
//   const router = useRouter();
//   const [classDetails, setClassDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const getToken = async () => {
//     try {
//       const token = await AsyncStorage.getItem("authToken");
//       return token;
//     } catch (error) {
//       console.error("Error retrieving token:", error);
//       return null;
//     }
//   };

//   const fetchClassDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = await getToken();
//       if (!token) {
//         throw new Error("Authentication token not found.");
//       }

//       const response = await axios.get(`${API_URL}/user/checker`, {
//         headers: { token },
//       });

//       setClassDetails(response.data.clas);
//     } catch (err) {
//       console.error("Error fetching class details:", err);
//       setError(err.message || "Failed to load class details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClassDetails();
//   }, []);

//   return (
      
//       <View style={styles.container}>
//         <Stack.Screen
//             options={{
//                headerShown: false,
//                animation: "slide_from_right",
//             }}
//          />
//         {loading ? (
//           <ActivityIndicator size="large" color="#1E73E8" />
//         ) : error ? (
//           <Text style={styles.errorText}>{error}</Text>
//         ) : classDetails ? (
//           <>
//             <Text style={styles.title}>Attendance Recorded</Text>
//             <View style={styles.detailsContainer}>
//               <Text style={styles.text}>Class: {classDetails.Title}</Text>
//               <Text style={styles.text}>
//                 Date: {new Date().toLocaleDateString()}
//               </Text>
//               <Text style={styles.text}>
//                 Duration: {classDetails.Hours} hours
//               </Text>
//             </View>
//             <TouchableOpacity
//               style={styles.button}
//               onPress={() => router.replace("(tabs)")}
//             >
//               <Text style={styles.buttonText}>Go to Home</Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           <Text style={styles.text}>No class details available.</Text>
//         )}
//       </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#D0C8F2",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "green",
//     marginBottom: 20,
//   },
//   detailsContainer: {
//     marginBottom: 30,
//   },
//   text: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   errorText: {
//     fontSize: 18,
//     color: "red",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#1E73E8",
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 50,
//     marginTop: 25,
//     elevation: 3,
//   },
//   buttonText: {
//     textAlign: "center",
//     fontSize: 16,
//     color: "white",
//     fontWeight: "bold",
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter,Stack} from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/header";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

export default function Recorded() {
  const router = useRouter();
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      return token;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  const fetchClassDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await axios.get(`${API_URL}/user/checker`, {
        headers: { token },
      });

      setClassDetails(response.data.clas);
    } catch (err) {
      console.error("Error fetching class details:", err);
      setError(err.message || "Failed to load class details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, []);

  return (
      
      <View style={styles.container}>
        <Stack.Screen
            options={{
               headerShown: false,
               animation: "slide_from_right",
            }}
         />
        {loading ? (
          <ActivityIndicator size="large" color="#1E73E8" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : classDetails ? (
          <>
            <Text style={styles.title}>Attendance Recorded</Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.text}>Class: {classDetails.Title}</Text>
              <Text style={styles.text}>
                Date: {new Date().toLocaleDateString()}
              </Text>
              <Text style={styles.text}>
                Duration: {classDetails.Hours} hours
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("(tabs)")}
            >
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.text}>No class details available.</Text>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#D0C8F2",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "green",
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1E73E8",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 25,
    elevation: 3,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

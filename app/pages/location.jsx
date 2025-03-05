import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [insideBoundary, setInsideBoundary] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationVerified, setLocationVerified] = useState(false);
  const locationSubscription = useRef(null);

  // Define boundary
  const BOUNDARY = {
    corner1: { lat: 15.4007844, lng: 75.0258996 },
    corner2: { lat: 15.4002653, lng: 75.0158310 },
    corner3: { lat: 15.3897100, lng: 75.0167238 },
    corner4: { lat: 15.3856518, lng: 75.0246933 },
  };
/*// Define boundary
  const BOUNDARY = {
    corner1: { lat: 15.3928349, lng: 75.0251171 },
    corner2: { lat: 15.3927314, lng: 75.0251674 },
    corner3: { lat: 15.3927683, lng: 75.0252418 },
    corner4: { lat: 15.3928711, lng: 75.0251902 },
  }; */
  // Function to check if inside boundary
  const isInsideBoundary = useCallback((latitude, longitude) => {
    const minLat = Math.min(
      BOUNDARY.corner1.lat,
      BOUNDARY.corner2.lat,
      BOUNDARY.corner3.lat,
      BOUNDARY.corner4.lat
    );
    const maxLat = Math.max(
      BOUNDARY.corner1.lat,
      BOUNDARY.corner2.lat,
      BOUNDARY.corner3.lat,
      BOUNDARY.corner4.lat
    );
    const minLng = Math.min(
      BOUNDARY.corner1.lng,
      BOUNDARY.corner2.lng,
      BOUNDARY.corner3.lng,
      BOUNDARY.corner4.lng
    );
    const maxLng = Math.max(
      BOUNDARY.corner1.lng,
      BOUNDARY.corner2.lng,
      BOUNDARY.corner3.lng,
      BOUNDARY.corner4.lng
    );

    return (
      latitude >= minLat &&
      latitude <= maxLat &&
      longitude >= minLng &&
      longitude <= maxLng
    );
  }, []);

  // Handle successful location verification
  const handleLocationVerified = useCallback(() => {
    setLocationVerified(true);
    // Navigate to biometric verification screen
    router.push("pages/biometric");
  }, [router]);

  // Location tracking effect
  useEffect(() => {
    const getLocation = async () => {
      try {
        // Check if location services are enabled
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          setErrorMsg("Please enable location services");
          Alert.alert(
            "Location Required",
            "Please enable location services to continue"
          );
          return;
        }

        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          Alert.alert(
            "Permission Denied",
            "Location permission is required to continue"
          );
          return;
        }

        // Start location watching
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (locationData) => {
            const { latitude, longitude } = locationData.coords;

            if (!locationVerified) {
              setLocation({ latitude, longitude });
              const inside = isInsideBoundary(latitude, longitude);
              setInsideBoundary(inside);

              if (inside) {
                // Store the subscription before removing it
                if (locationSubscription.current) {
                  locationSubscription.current();
                }
                handleLocationVerified();
              }
            }
          }
        );

        // Store the remove function
        locationSubscription.current = subscription.remove;

      } catch (error) {
        setErrorMsg("Error getting location: " + error.message);
        Alert.alert("Error", "Failed to get location. Please try again.");
      }
    };

    if (!locationVerified) {
      getLocation();
    }

    // Cleanup function
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current();
      }
    };
  }, [locationVerified, isInsideBoundary, handleLocationVerified]);

  return (
    <View style={styles.container}>
        {location && !locationVerified ? (
          <Text style={styles.text}>Fetching your location...</Text>
        ) : locationVerified ? (
          <Text style={styles.text}>
            Location verified! Proceeding to biometric verification...
          </Text>
        ) : (
          <Text style={styles.text}>Initializing location services...</Text>
        )}

        {insideBoundary !== null && (
          <Text style={styles.text}>
            Inside Boundary: {insideBoundary ? "✅ Yes" : "❌ No"}
          </Text>
        )}

        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
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
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  image: { width: 240, height: 240 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    width: "90%",
    marginBottom: 30,
  },
  titleSignedIn: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#007bff",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#1E73E8",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 25,
    elevation: 3,
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  errorText: { fontSize: 16, color: "red", marginTop: 10 },
});
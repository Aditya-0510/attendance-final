import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Header from "../../components/header";

export default function Attendance() {
  const router = useRouter();

  return (
    <View style={styles.container} >
      <Header/>
      {/* Back Button */}
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

      {/* Title */}
      <Text style={styles.title}>xx% of classes conducted</Text>

      {/* Pie Chart Placeholder */}
      <View style={styles.pieChart}></View>

      {/* Attendance Details */}
      <View style={styles.infoBox}>
        <Text>No. of hours conducted xx</Text>
        <Text>No. of hours attended xx</Text>
        <Text>No. of hours missed xx</Text>
      </View>

      <View style={styles.infoBox}>
        <Text>No. of hours required to maintain 85% : xx</Text>
        <Text>No. of hours required to reach 85% : xx</Text>
      </View>
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
    // backgroundColor: "#D0D0D0",
    padding: 10,
    borderRadius: 10,
  },
  title: {
    marginTop: 80,
    fontSize: 18,
    fontStyle: "italic",
  },
  pieChart: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#7DCEF3", // Placeholder for the Pie Chart
    alignSelf: "center",
    marginVertical: 20,
  },
  infoBox: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});

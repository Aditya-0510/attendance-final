import { StyleSheet, Text, View, TouchableOpacity,Platform,StatusBar } from 'react-native'
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React from 'react'

export default function header() {
    const router = useRouter();
    return (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.headerRightIcons}>
                    <TouchableOpacity 
                        style={styles.iconSpacing}
                        onPress={() => router.push("pages/notification")}
                    >
                        <Feather name="bell" size={24} color="black" />
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => router.push("pages/menu")}>
                        <FontAwesome name="user-circle-o" size={24} color="white" />
                    </TouchableOpacity> */}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 20, // Adds padding on both sides
        width: '100%',
        // backgroundColor:"#1E73E8",
        height:50,
        top:'40',
        left:'10',
        zIndex:10
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 2,
        paddingVertical: 10, // Adds some vertical padding
    },
    headerRightIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    iconSpacing: {
        marginRight: 15,
    },
})
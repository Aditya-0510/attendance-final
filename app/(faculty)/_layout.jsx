import React, { useEffect, useState } from 'react'
import {Tabs} from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome'; 

export default function TabLayout() {

  return (
    <Tabs screenOptions={{
        headerShown:false
      }}>
        <Tabs.Screen name='index' 
            options={{
                tabBarLabel:"Home",
                tabBarIcon:({color,size}) =>(
                    <Entypo name="home" size={size} color={color} />
                )
            }}
        />
        <Tabs.Screen name="menu" 
            options={{
                tabBarLabel:"Profile",
                tabBarIcon:({color,size}) =>(
                    <Entypo name="user" size={size} color={color} />
                )
            }}
        />
        
    </Tabs>
  );
}

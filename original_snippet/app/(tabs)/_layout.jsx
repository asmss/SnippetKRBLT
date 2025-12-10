import { Tabs } from 'expo-router';
import React from 'react';
import { View, Platform } from 'react-native';
import { useAuth } from '@/context/authContext';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: '#999',

        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 70,
          paddingBottom: 10,
          borderRadius: 20,
          backgroundColor: "#211f1fff",
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        },

        tabBarIconStyle: {
          transform: [{ scale: route.name === 'index' ? 1.15 : 1 }],
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <IconSymbol size={focused ? 32 : 26} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="addSnippetScreen"
        options={{
          title: 'Add Snippet',
          tabBarIcon: ({ color, size, focused }) => (
            <IconSymbol size={focused ? 32 : 26} name="plus.circle.fill" color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name= "chat"
        options={{
          title: 'Asistan',
          tabBarIcon: ({ color, size, focused }) => (
            <IconSymbol size={focused ? 32 : 26} name="message" color={color} />
          ),
          
        }}
        
      />
    </Tabs>
    
  );
}

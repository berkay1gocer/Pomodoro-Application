import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import ReportsScreen from './src/screens/ReportsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: '#95a5a6',
          tabBarStyle: {
            height: 70,
            paddingBottom: 15,
            paddingTop: 10,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 10,
            zIndex: 999,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '600',
            marginBottom: 5,
          },
        }}
      >
        <Tab.Screen
          name="Ana Sayfa"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24 }}>🎯</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Raporlar"
          component={ReportsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24 }}>📊</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

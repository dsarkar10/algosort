import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import HowToPlayScreen from './src/screens/HowToPlayScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';
import PatternSelectScreen from './src/screens/PatternSelectScreen';
import PatternGameScreen from './src/screens/PatternGameScreen';
import PatternResultScreen from './src/screens/PatternResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0f172a' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LevelSelect" component={LevelSelectScreen} />
        <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="PatternSelect" component={PatternSelectScreen} />
        <Stack.Screen name="PatternGame" component={PatternGameScreen} />
        <Stack.Screen name="PatternResult" component={PatternResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

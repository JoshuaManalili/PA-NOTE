import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import LandingScreen from '../screens/LandingScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import QuizListScreen from '../screens/QuizListScreen';
import ActiveQuizScreen from '../screens/ActiveQuizScreen';
import QuizResultsScreen from '../screens/QuizResultsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ArchivesScreen from '../screens/ArchivesScreen';
import TrashScreen from '../screens/TrashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Main" component={LandingScreen} />
        <Stack.Screen name="QuizList" component={QuizListScreen} />
        <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
        <Stack.Screen name="ActiveQuiz" component={ActiveQuizScreen} />
        <Stack.Screen name="QuizResults" component={QuizResultsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Archives" component={ArchivesScreen} />
        <Stack.Screen name="Trash" component={TrashScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Session } from '@supabase/supabase-js';
import { RootStackParamList } from '../types';
import { supabase } from '../lib/supabase';

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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the current session on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for any future auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Show a loading spinner while checking session
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0B4A8E" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        {session ? (
          // ✅ User is logged in — show main app screens
          <>
            <Stack.Screen name="Main" component={LandingScreen} />
            <Stack.Screen name="QuizList" component={QuizListScreen} />
            <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
            <Stack.Screen name="ActiveQuiz" component={ActiveQuizScreen} />
            <Stack.Screen name="QuizResults" component={QuizResultsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Archives" component={ArchivesScreen} />
            <Stack.Screen name="Trash" component={TrashScreen} />
          </>
        ) : (
          // 🔒 User is not logged in — show auth screens
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#C5F5FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

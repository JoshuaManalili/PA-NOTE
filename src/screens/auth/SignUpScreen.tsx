import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import { supabase } from '../../lib/supabase';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const navigation = useNavigation<Nav>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: { username: username.trim() },
      },
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
      return;
    }

    if (data.session) {
      // ✅ Email confirmation is OFF in Supabase — user is logged in directly.
      // AppNavigator detects the session and redirects automatically.
    } else {
      // ✅ Email confirmation is ON — guide user to check their email.
      Alert.alert(
        'Check your email 📧',
        'We sent a confirmation link to ' + email.trim() + '. Verify your email, then sign in.',
        [{ text: 'Go to Sign In', onPress: () => navigation.navigate('SignIn') }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoArea}>
          <Text style={styles.appName}>PA-NOTE</Text>
          <Text style={styles.tagline}>Sign Up</Text>
        </View>

        <View style={styles.card}>
          <FormInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <FormInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FormInput
            placeholder="Password (min. 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <FormInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <PrimaryButton
            label="Create Account"
            onPress={handleSignUp}
            loading={loading}
            style={styles.signupBtn}
          />

          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.loginLink}>
              Already have an account? <Text style={styles.linkBold}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#C5F5FA' },
  container: {
    flexGrow: 1,
    backgroundColor: '#C5F5FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0B4A8E',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0B4A8E',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#EAF9FB',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#0B4A8E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  signupBtn: {
    marginTop: 4,
    marginBottom: 12,
  },
  loginLink: {
    textAlign: 'center',
    color: '#4A7A99',
    fontSize: 13,
  },
  linkBold: {
    fontWeight: '700',
    color: '#0B4A8E',
  },
});

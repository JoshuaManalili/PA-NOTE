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

type Nav = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SignInScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
    }
    // ✅ No navigation.reset() needed — AppNavigator detects the session
    // and automatically switches to the main app screens.
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
        {/* Logo */}
        <View style={styles.logoArea}>
          <Text style={styles.appName}>PA-NOTE</Text>
          <Text style={styles.tagline}>Sign In</Text>
        </View>

        <View style={styles.card}>
          <FormInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FormInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <PrimaryButton
            label="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>
              Don't have an account? <Text style={styles.linkBold}>Sign up</Text>
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
    textDecorationLine: 'underline',
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
  loginBtn: {
    marginBottom: 12,
    marginTop: 8,
  },
  signupLink: {
    textAlign: 'center',
    color: '#4A7A99',
    fontSize: 13,
  },
  linkBold: {
    fontWeight: '700',
    color: '#0B4A8E',
  },
});

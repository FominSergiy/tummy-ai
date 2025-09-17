import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { TummyAILogo } from '../Logo';
import { InputField, SignButton, Title } from './components';

export function Login() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isSignup, setIsSignup] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  // if all well we do redirect
  if (loggedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement actual authentication logic
      // For now, just simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoggedIn(true);
      // TODO: do something with caught error
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setConfirmPassword('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <TummyAILogo />
        </View>

        <View style={styles.formContainer}>
          <Title isSignUp={isSignup} />

          <InputField
            label="Email"
            textInputProps={{
              value: email,
              onChangeText: setEmail,
              placeholder: 'Enter your email',
              autoCapitalize: 'none',
              keyboardType: 'email-address',
              autoComplete: 'email',
            }}
          />

          <InputField
            label="Password"
            textInputProps={{
              value: password,
              onChangeText: setPassword,
              placeholder: 'Enter your password',
              secureTextEntry: true,
              autoComplete: 'password',
            }}
          />

          {isSignup && (
            <InputField
              label="Confirm Password"
              textInputProps={{
                value: confirmPassword,
                onChangeText: setConfirmPassword,
                placeholder: 'Confirm your password',
                secureTextEntry: true,
                autoComplete: 'password',
              }}
            />
          )}

          <SignButton
            isSignUp={isSignup}
            loading={loading}
            handleSubmit={handleSubmit}
            toggleMode={toggleMode}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

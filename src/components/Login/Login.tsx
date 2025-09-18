import { Redirect } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { apiService } from '../../services/api.service';
import { TummyAILogo } from '../Logo';
import { InputField, SignButton, Title } from './components';

const testRegex = (str: string, regex: RegExp) => {
  // skip using rule for empty string
  return regex.test(str);
};

// skip empty strings
const isValidEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return email ? testRegex(email, regex) : true;
};

const isValidPassword = (password: string) => {
  // 8 characters - 1 uppercase, 1 special character and 1 digit
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}/;
  return password ? testRegex(password, regex) : true;
};

export function Login() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isSignup, setIsSignup] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const isAuthenticated = await apiService.isAuthenticated();
        if (isAuthenticated) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  // Show loading while checking authentication
  if (checkingAuth) {
    return null; // or a loading spinner component
  }

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
      if (isSignup) {
        await apiService.signup({ email, password });
        Alert.alert('Success', 'Account created successfully! Please log in.');
        setIsSignup(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        const response = await apiService.login({ email, password });
        if (response.success) {
          setLoggedIn(true);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Authentication failed. Please try again.';
      Alert.alert('Error', errorMessage);
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
            warning={{
              showWarning: isSignup ? !isValidEmail(email) : false,
              warningMessage: 'Please enter valid email',
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
            warning={{
              // skip warning display for sign up - password has to be valid at this point
              showWarning: isSignup ? !isValidPassword(password) : false,
              warningMessage:
                'Your password has to have at least 1 Upper-case char, 1 digit, and 1 special case char',
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
              warning={{
                showWarning: !(password === confirmPassword),
                warningMessage: 'Passwords have to match',
              }}
            />
          )}

          <SignButton
            isSignUp={isSignup}
            lockSignUp={
              !isValidPassword(password) ||
              !isValidEmail(email) ||
              !(password === confirmPassword) ||
              !email
            }
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

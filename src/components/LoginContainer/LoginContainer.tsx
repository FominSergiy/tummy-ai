import { useAuth } from '@/src/providers';
import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { TummyAILogo } from '../Logo';
import { SignIn, SignUp } from './components';

const LoginContainer = () => {
  const [toggleSignIn, setToggleSignIn] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  // if all well we do redirect
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  const toggleMode = () => {
    setToggleSignIn(!toggleSignIn);
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

        {toggleSignIn ? (
          <SignIn parentToggle={toggleMode} />
        ) : (
          <SignUp parentToggle={toggleMode} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
});

export { LoginContainer };

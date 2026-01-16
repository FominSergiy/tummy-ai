import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TitleProps {
  isSignUp: boolean;
}

export const Title = ({ isSignUp }: TitleProps) => {
  return (
    <View>
      <Text style={styles.title}>
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </Text>
      <Text style={styles.subtitle}>
        {isSignUp
          ? 'Sign up to get started with Tummy AI'
          : 'Sign in to your account'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
});

import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TummyAILogo } from '../components';

export default function Login() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // if all well we do redirect
  if (loggedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <TummyAILogo />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loginContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 100,
    paddingBottom: 100,
  },
});

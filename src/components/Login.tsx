import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export function Login() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // if all well we do redirect
  if (loggedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <View style={styles.container}>
      <svg
        width="160"
        height="40"
        viewBox="0 0 160 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* <!-- Icon --> */}
        <g transform="translate(5, 7.5)">
          <ellipse
            cx="12.5"
            cy="12.5"
            rx="10"
            ry="9"
            fill="#FFE4D6"
            stroke="#FFB5A3"
            strokeWidth="1"
          />
          <ellipse
            cx="12.5"
            cy="12.5"
            rx="7"
            ry="6"
            fill="#FFD4C4"
            opacity="0.8"
          />
          <circle cx="8" cy="9" r="1" fill="#FF9A8B" opacity="0.9" />
          <circle cx="17" cy="11" r="1" fill="#FF9A8B" opacity="0.9" />
          <circle cx="10" cy="16" r="0.8" fill="#FFC3B8" opacity="0.8" />
          <circle cx="16" cy="15" r="0.8" fill="#FFC3B8" opacity="0.8" />
          <path
            d="M 9 14 Q 12.5 17 16 14"
            stroke="#FF8A75"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* <!-- Text --> */}
        <text
          x="40"
          y="28"
          fontFamily="Arial, sans-serif"
          fontSize="18"
          fontWeight="300"
          fill="#FF8A75"
          letterSpacing="0.5px"
        >
          tummy ai
        </text>
      </svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

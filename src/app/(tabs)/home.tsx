import { ImageAnalyzeContainer } from '@/src/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function HomeTab() {
  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <ImageAnalyzeContainer />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

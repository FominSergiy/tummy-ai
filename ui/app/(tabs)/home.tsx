import UploadContainer from '@/ui/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <UploadContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import UploadComponent from '../../components/UploadComponent';
import UploadTypeDropdown, {
  UploadType,
} from '../../components/UploadTypeDropdown';

export default function HomeTab() {
  const [selectedUploadType, setSelectedUploadType] =
    useState<UploadType>('text');

  const handleUpload = () => {
    Alert.alert('Upload', `Ready to upload ${selectedUploadType}`, [
      { text: 'OK' },
    ]);
  };

  return (
    <View style={styles.container}>
      <UploadTypeDropdown
        selectedType={selectedUploadType}
        onTypeChange={setSelectedUploadType}
      />
      <View style={styles.centerContent}>
        <UploadComponent onUpload={handleUpload} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

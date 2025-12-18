import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PictureUpload } from './components/PictureUpload';

const UploadContainer = () => {
  const handleSave = (data: object) => {
    console.log('Saved data:', data);
    // Here you can handle the saved data - send to server, store locally, etc.
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.uploadSection}>
          <PictureUpload onSave={handleSave} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 40,
  },
  uploadSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export { UploadContainer };

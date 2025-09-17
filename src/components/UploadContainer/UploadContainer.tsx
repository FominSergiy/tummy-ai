import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AudioRecorder from './components/AudioRecorder';
import UploadTypeDropdown, { UploadType } from './components/Dropdown';
import PictureUpload from './components/PictureUpload';
import TextInputComponent from './components/TextInput';

const UploadContainer = () => {
  const [selectedUploadType, setSelectedUploadType] =
    useState<UploadType>('picture');

  const handleSave = (data: object) => {
    console.log('Saved data:', data);
    // Here you can handle the saved data - send to server, store locally, etc.
  };

  const renderUploadComponent = () => {
    switch (selectedUploadType) {
      case 'text':
        return <TextInputComponent onSave={handleSave} />;
      case 'audio':
        return <AudioRecorder onSave={handleSave} />;
      case 'picture':
        return <PictureUpload onSave={handleSave} />;
      default:
        return <TextInputComponent onSave={handleSave} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.dropdownContainer}>
          <UploadTypeDropdown
            selectedType={selectedUploadType}
            onTypeChange={setSelectedUploadType}
          />
        </View>
        <View style={styles.uploadSection}>{renderUploadComponent()}</View>
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
  dropdownContainer: {
    alignItems: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
    marginTop: -20,
    zIndex: 1,
  },
  uploadSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export { UploadContainer };

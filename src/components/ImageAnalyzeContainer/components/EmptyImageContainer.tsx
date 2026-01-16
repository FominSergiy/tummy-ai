import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EmptyImageContainerProps {
  showImagePicker: () => void;
}

const EmptyImageContainer = ({ showImagePicker }: EmptyImageContainerProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={showImagePicker}>
        <View style={styles.selectContent}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.selectText}>Select Image</Text>
          <Text style={styles.selectSubtext}>Camera or Photo Library</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButton: {
    width: 300,
    height: 300,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectContent: {
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  selectText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectSubtext: {
    fontSize: 14,
    color: '#666',
  },
});

export { EmptyImageContainer };

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UploadProps {
  onUpload: () => void;
}

export default function Upload({ onUpload }: UploadProps) {
  return (
    <TouchableOpacity style={styles.uploadContainer} onPress={onUpload}>
      <View style={styles.uploadContent}>
        <Text style={styles.uploadText}>+</Text>
        <Text style={styles.uploadLabel}>Tap to Upload</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  uploadContainer: {
    width: 200,
    height: 200,
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
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 48,
    color: '#999',
    fontWeight: '300',
  },
  uploadLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});

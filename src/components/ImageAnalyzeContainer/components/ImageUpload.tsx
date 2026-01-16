import * as ImagePicker from 'expo-image-picker';
import React, { useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ImageData } from '../ImageAnalyzeContainer.types';
import { EmptyImageContainer } from './EmptyImageContainer';
import { FilledImageContainer } from './FilledImageContainer';

interface ImageUploadProps {
  selectedImage: ImageData | null;
  onImageSelect: (image: ImageData) => void;
  onImageClear: () => void;
  onAnalyze: () => void;
  isUploading?: boolean;
}

const ImageUpload = ({
  selectedImage,
  onImageSelect,
  onImageClear,
  onAnalyze,
  isUploading = false,
}: ImageUploadProps) => {
  const requestPermissions = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please enable photo library access to select images.'
      );
      return false;
    }
    return true;
  }, []);

  const requestCameraPermissions = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please enable camera access to take photos.'
      );
      return false;
    }
    return true;
  }, []);

  const getFileNameFromUri = useCallback((uri: string): string => {
    const filename = uri.split('/').pop() || `image-${Date.now()}.jpg`;
    return filename;
  }, []);

  const getMimeTypeFromUri = useCallback((uri: string): string => {
    const extension = uri.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    };
    return mimeTypes[extension || ''] || 'image/jpeg';
  }, []);

  const handleImageResult = useCallback(
    (uri: string) => {
      onImageSelect({
        uri,
        fileName: getFileNameFromUri(uri),
        mimeType: getMimeTypeFromUri(uri),
      });
    },
    [onImageSelect, getFileNameFromUri, getMimeTypeFromUri]
  );

  const takePhoto = useCallback(async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleImageResult(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  }, [requestCameraPermissions, handleImageResult]);

  const pickImage = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleImageResult(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  }, [requestPermissions, handleImageResult]);

  const showImagePicker = useCallback(() => {
    Alert.alert('Select Image', 'Choose how you want to add an image', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Photo Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [takePhoto, pickImage]);

  const handleAnalyze = useCallback(() => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }
    onAnalyze();
  }, [selectedImage, onAnalyze]);

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <FilledImageContainer
          selectedImage={selectedImage}
          isUploading={isUploading}
          showImagePicker={showImagePicker}
          onImageClear={onImageClear}
          handleAnalyze={handleAnalyze}
        />
      ) : (
        <EmptyImageContainer showImagePicker={showImagePicker} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { ImageUpload };

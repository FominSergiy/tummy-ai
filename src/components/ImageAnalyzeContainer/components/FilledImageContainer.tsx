import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ImageData } from '../ImageAnalyzeContainer.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = Math.min(SCREEN_WIDTH * 0.8, 300);

interface FilledImageContainerProps {
  selectedImage: ImageData;
  isUploading: boolean;
  showImagePicker: () => void;
  onImageClear: () => void;
  handleAnalyze: () => void;
}

const FilledImageContainer = ({
  selectedImage,
  isUploading,
  showImagePicker,
  onImageClear,
  handleAnalyze,
}: FilledImageContainerProps) => {
  return (
    <View style={styles.container}>
      {/* Image Section - centered in remaining space */}
      <View style={styles.imageSection}>
        <Image
          source={{ uri: selectedImage.uri }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Action Buttons - anchored at bottom */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.secondaryButton, isUploading && styles.disabledButton]}
          onPress={showImagePicker}
          disabled={isUploading}
        >
          <Text style={styles.secondaryButtonText}>Change</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.clearButton, isUploading && styles.disabledButton]}
          onPress={onImageClear}
          disabled={isUploading}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, isUploading && styles.disabledButton]}
          onPress={handleAnalyze}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.primaryButtonText}>Analyze</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  clearButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export { FilledImageContainer };

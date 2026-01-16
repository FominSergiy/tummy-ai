import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ImageData } from '../ImageAnalyzeContainer.types';

interface ImagePreviewProps {
  image: ImageData;
  size?: number;
}

const ImagePreview = ({ image, size = 80 }: ImagePreviewProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image.uri }}
        style={[styles.image, { width: size, height: size }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: 12,
  },
});

export { ImagePreview };

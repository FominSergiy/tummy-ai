import { apiService } from '@/src/services';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { PictureUpload } from './components/PictureUpload';

const ANALYZE_ROUTE = '/ingredients/analyze';

export type handleDataType = {
  type: string;
  uri: string;
  fileName: string;
  mimeType: string;
  timestamp: string;
  source: string;
};

interface AnalyzeResponse {
  success: boolean;
  data: {
    fileKey: string;
    tempKey: string;
    url: string;
  };
}

const UploadContainer = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async (data: handleDataType) => {
    setIsUploading(true);

    try {
      const response = await apiService.uploadFile<AnalyzeResponse>(
        ANALYZE_ROUTE,
        data.uri,
        data.fileName,
        data.mimeType,
        false // Set to true if authentication is required
      );

      if (response.success) {
        Alert.alert(
          'Success',
          `Image uploaded successfully!\nFile Key: ${response.data.fileKey}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert(
        'Upload Failed',
        error instanceof Error ? error.message : 'Failed to upload image',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.uploadSection}>
          <PictureUpload onSave={handleSave} isUploading={isUploading} />
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

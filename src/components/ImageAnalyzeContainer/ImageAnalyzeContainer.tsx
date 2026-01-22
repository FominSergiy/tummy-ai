import { apiService } from '@/src/services';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { AnalysisActions } from './components/AnalysisActions';
import { AnalysisForm } from './components/AnalysisForm';
import { ImagePreview } from './components/ImagePreview';
import { ImageUpload } from './components/ImageUpload';
import {
  AnalysisData,
  AnalyzeResponse,
  ImageData,
  // ReanalyzeResponse,
  UploadState,
} from './ImageAnalyzeContainer.types';

const ANALYZE_ROUTE = '/ingredients/analyze';

const ImageAnalyzeContainer = () => {
  const [uploadState, setUploadState] = useState<UploadState>('initial');
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [userPrompt, setUserPrompt] = useState<string>('');

  const handleImageSelect = useCallback((image: ImageData) => {
    setSelectedImage(image);

    setUploadState('image_selected');
    // Clear previous analysis if any
    setAnalysisId(null);
    setAnalysisData(null);
  }, []);

  const handleImageClear = useCallback(() => {
    setSelectedImage(null);
    setUploadState('initial');
    setAnalysisId(null);
    setAnalysisData(null);
    setUserPrompt('');
  }, []);

  const handlePromptChange = useCallback((text: string) => {
    setUserPrompt(text);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedImage) return;

    setUploadState('uploading');

    try {
      const response = await apiService.uploadFile<AnalyzeResponse>(
        ANALYZE_ROUTE,
        selectedImage.uri,
        selectedImage.fileName,
        selectedImage.mimeType,
        true,
        userPrompt.trim() || undefined
      );

      if (response.success) {
        setAnalysisId(response.analysisId);
        setAnalysisData(response.analysis);
        setUploadState('analysis_ready');
        setUserPrompt('');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Analysis failed';
      setUploadState('image_selected'); // if analysis failed we should allow to re-try
      Alert.alert('Analysis Failed', errorMessage);
    }
  }, [selectedImage, userPrompt]);

  const handleSave = useCallback(async () => {
    if (!analysisId || !analysisData) return;

    setUploadState('saving');

    try {
      await apiService.commitAnalysis(analysisId, {
        mealTitle: analysisData.mealTitle,
        mealDescription: analysisData.mealDescription,
      });

      Alert.alert('Success', 'Analysis saved successfully!');

      // Reset to initial state for next upload
      setSelectedImage(null);
      setAnalysisId(null);
      setAnalysisData(null);
      setUploadState('initial');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Save failed';
      setUploadState('analysis_ready'); // Stay on analysis screen
      Alert.alert('Save Failed', errorMessage);
    }
  }, [analysisId, analysisData]);

  const handleAnalysisChange = useCallback(
    <K extends keyof AnalysisData>(field: K, value: AnalysisData[K]) => {
      setAnalysisData((prev) => (prev ? { ...prev, [field]: value } : null));
    },
    []
  );

  const { isUploading, isSaving, hasAnalysis, isProcessing } = useMemo(() => {
    const processingStates: UploadState[] = [
      'uploading',
      'resubmitting',
      'saving',
    ];
    return {
      isUploading: uploadState === 'uploading',
      isResubmitting: uploadState === 'resubmitting',
      isSaving: uploadState === 'saving',
      hasAnalysis: uploadState === 'analysis_ready' && analysisData !== null,
      isProcessing: processingStates.includes(uploadState),
    };
  }, [uploadState, analysisData]);

  const showImageUpload = useMemo(() => {
    const imageSelectStates = ['initial', 'image_selected', 'uploading'];
    return imageSelectStates.includes(uploadState);
  }, [uploadState]);

  return (
    <View style={styles.container}>
      {showImageUpload ? (
        // Initial state: Image selection and upload
        <ImageUpload
          selectedImage={selectedImage}
          onImageSelect={handleImageSelect}
          onImageClear={handleImageClear}
          onAnalyze={handleAnalyze}
          isUploading={isUploading}
          userPrompt={userPrompt}
          onPromptChange={handlePromptChange}
        />
      ) : (
        // Analysis ready: Show compact image + form + actions
        <View style={styles.analysisContainer}>
          {/* Compact Image Preview */}
          {selectedImage && (
            <View style={styles.compactImageSection}>
              <ImagePreview image={selectedImage} size={80} />
            </View>
          )}

          {/* Analysis Form */}
          {hasAnalysis && (
            <ScrollView
              style={styles.formContainer}
              contentContainerStyle={styles.formContent}
            >
              <AnalysisForm
                analysis={analysisData as AnalysisData}
                onChange={handleAnalysisChange}
                isDisabled={isProcessing}
              />
            </ScrollView>
          )}

          {/* Action Buttons */}
          {hasAnalysis && (
            <AnalysisActions
              // onResubmit={handleResubmit}
              onSave={handleSave}
              // isResubmitting={isResubmitting}
              isSaving={isSaving}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  analysisContainer: {
    flex: 1,
  },
  compactImageSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    padding: 12,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 16,
  },
});

export { ImageAnalyzeContainer };

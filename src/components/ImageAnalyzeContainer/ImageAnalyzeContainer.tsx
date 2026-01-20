import { apiService } from '@/src/services';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnalysisActions } from './components/AnalysisActions';
import { AnalysisForm } from './components/AnalysisForm';
import { ImagePreview } from './components/ImagePreview';
import { ImageUpload } from './components/ImageUpload';
import {
  AnalysisData,
  AnalyzeResponse,
  ImageData,
  ReanalyzeResponse,
  UploadState,
} from './ImageAnalyzeContainer.types';

const ANALYZE_ROUTE = '/ingredients/analyze';

const ImageAnalyzeContainer = () => {
  const [uploadState, setUploadState] = useState<UploadState>('initial');
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState<string>('');

  const handleImageSelect = useCallback((image: ImageData) => {
    setSelectedImage(image);

    setUploadState('image_selected');
    // Clear previous analysis if any
    setAnalysisId(null);
    setAnalysisData(null);
    setError(null);
  }, []);

  const handleImageClear = useCallback(() => {
    setSelectedImage(null);
    setUploadState('initial');
    setAnalysisId(null);
    setAnalysisData(null);
    setError(null);
    setUserPrompt('');
  }, []);

  const handlePromptChange = useCallback((text: string) => {
    setUserPrompt(text);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedImage) return;

    setUploadState('uploading');
    setError(null);

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
      setError(errorMessage);
      setUploadState('error');
      Alert.alert('Analysis Failed', errorMessage);
    }
  }, [selectedImage, userPrompt]);

  const handleResubmit = useCallback(async () => {
    if (!analysisId || !analysisData) return;

    setUploadState('resubmitting');
    setError(null);

    try {
      const response = await apiService.reanalyzeWithEdits<ReanalyzeResponse>(
        analysisId,
        {
          mealTitle: analysisData.mealTitle,
          mealDescription: analysisData.mealDescription,
        }
      );

      if (response.success) {
        setAnalysisData(response.analysis);
        setUploadState('analysis_ready');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Reanalysis failed';
      setError(errorMessage);
      setUploadState('analysis_ready'); // Stay on analysis screen
      Alert.alert('Reanalysis Failed', errorMessage);
    }
  }, [analysisId, analysisData]);

  const handleSave = useCallback(async () => {
    if (!analysisId || !analysisData) return;

    setUploadState('saving');
    setError(null);

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
      setError(errorMessage);
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

  const isUploading = uploadState === 'uploading';
  const isResubmitting = uploadState === 'resubmitting';
  const isSaving = uploadState === 'saving';
  const hasAnalysis = uploadState === 'analysis_ready' && analysisData !== null;
  const isProcessing = isUploading || isResubmitting || isSaving;

  const showImageUpload = useMemo(
    () =>
      uploadState === 'initial' ||
      uploadState === 'image_selected' ||
      uploadState === 'uploading',
    [uploadState]
  );

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

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Analysis Form */}
          {hasAnalysis && (
            <ScrollView
              style={styles.formContainer}
              contentContainerStyle={styles.formContent}
            >
              <AnalysisForm
                analysis={analysisData}
                onChange={handleAnalysisChange}
                isDisabled={isProcessing}
              />
            </ScrollView>
          )}

          {/* Action Buttons */}
          {hasAnalysis && (
            <AnalysisActions
              onResubmit={handleResubmit}
              onSave={handleSave}
              isResubmitting={isResubmitting}
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
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 16,
  },
});

export { ImageAnalyzeContainer };

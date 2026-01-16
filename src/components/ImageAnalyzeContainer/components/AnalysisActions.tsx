import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface AnalysisActionsProps {
  onResubmit: () => void;
  onSave: () => void;
  isResubmitting: boolean;
  isSaving: boolean;
}

export const AnalysisActions = ({
  onResubmit,
  onSave,
  isResubmitting,
  isSaving,
}: AnalysisActionsProps) => {
  const isDisabled = isResubmitting || isSaving;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.resubmitButton, isDisabled && styles.disabledButton]}
        onPress={onResubmit}
        disabled={isDisabled}
      >
        {isResubmitting ? (
          <ActivityIndicator color="#007AFF" size="small" />
        ) : (
          <Text style={styles.resubmitText}>Re-submit to LLM</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveButton, isDisabled && styles.disabledButton]}
        onPress={onSave}
        disabled={isDisabled}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.saveText}>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  resubmitButton: {
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
  saveButton: {
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
  disabledButton: {
    opacity: 0.5,
  },
  resubmitText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SignButtonProps {
  isSignUp: boolean;
  loading: boolean;
  handleSubmit: () => void;
  toggleMode: () => void;
}

export const SignButton = ({
  isSignUp,
  loading,
  handleSubmit,
  toggleMode,
}: SignButtonProps) => {
  return (
    <View>
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        </Text>
        <TouchableOpacity onPress={toggleMode}>
          <Text style={styles.toggleLink}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: '#FF8A75',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
    marginRight: 4,
  },
  toggleLink: {
    fontSize: 16,
    color: '#FF8A75',
    fontWeight: '600',
  },
});

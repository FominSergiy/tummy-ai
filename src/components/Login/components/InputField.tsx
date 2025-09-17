import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

interface InputFieldProps {
  label: string;
  warning: { warningMessage?: string; showWarning: boolean };
  textInputProps: TextInputProps;
}

const InputField = ({ label, warning, textInputProps }: InputFieldProps) => {
  const { warningMessage, showWarning } = warning;
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...textInputProps}
        style={styles.input}
        placeholderTextColor="#999"
      />
      {showWarning && <Text style={styles.warning}>{warningMessage}</Text>}
    </View>
  );
};

export { InputField };

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  warning: {
    color: '#c91d22',
    fontSize: 14,
    padding: 8,
  },
});

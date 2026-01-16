import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

interface TextInputComponentProps {
  onSave: (data: object) => void;
}

export default function TextInputComponent({
  onSave,
}: TextInputComponentProps) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  const handleSave = () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    const jsonData = {
      type: 'text',
      title: title.trim() || 'Untitled',
      content: text.trim(),
      timestamp: new Date().toISOString(),
      wordCount: text.trim().split(/\s+/).length,
      characterCount: text.length,
    };

    onSave(jsonData);

    // Show JSON output for debugging
    Alert.alert(
      'Text Saved',
      `JSON Output:\n${JSON.stringify(jsonData, null, 2)}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title (optional)</Text>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter a title..."
        maxLength={100}
      />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        placeholder="Start typing your text here..."
        multiline
        textAlignVertical="top"
      />

      <View style={styles.statsContainer}>
        <Text style={styles.stats}>
          Characters: {text.length} | Words:{' '}
          {text.trim() ? text.trim().split(/\s+/).length : 0}
        </Text>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save as JSON</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 200,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  stats: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

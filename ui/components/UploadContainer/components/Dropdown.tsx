import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type UploadType = 'text' | 'audio' | 'picture';

interface UploadTypeDropdownProps {
  selectedType: UploadType;
  onTypeChange: (type: UploadType) => void;
}

const uploadTypes: { key: UploadType; label: string; icon: string }[] = [
  { key: 'picture', label: 'Picture', icon: '📷' },
  { key: 'audio', label: 'Audio', icon: '🎤' },
  { key: 'text', label: 'Text', icon: '📝' },
];

export default function UploadTypeDropdown({
  selectedType,
  onTypeChange,
}: UploadTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = uploadTypes.find((type) => type.key === selectedType);

  const handleSelectType = (type: UploadType) => {
    onTypeChange(type);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.selectedText}>
          {selectedOption?.icon} {selectedOption?.label}
        </Text>
        <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={uploadTypes}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.key === selectedType && styles.selectedOption,
                  ]}
                  onPress={() => handleSelectType(item.key)}
                >
                  <Text style={styles.optionText}>
                    {item.icon} {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingLeft: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f8f9ff',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
});

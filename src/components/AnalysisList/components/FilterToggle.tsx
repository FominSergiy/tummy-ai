import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FilterMode } from '../AnalysisListContainer.types';

interface FilterToggleProps {
  activeFilter: FilterMode;
  onFilterChange: (filter: FilterMode) => void;
}

export const FilterToggle = ({
  activeFilter,
  onFilterChange,
}: FilterToggleProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, activeFilter === 'today' && styles.activeButton]}
        onPress={() => onFilterChange('today')}
      >
        <Text
          style={[
            styles.buttonText,
            activeFilter === 'today' && styles.activeButtonText,
          ]}
        >
          Today
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          activeFilter === 'historical' && styles.activeButton,
        ]}
        onPress={() => onFilterChange('historical')}
      >
        <Text
          style={[
            styles.buttonText,
            activeFilter === 'historical' && styles.activeButtonText,
          ]}
        >
          Historical
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
  },
});

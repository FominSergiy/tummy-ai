import { StyleSheet, Text, View } from 'react-native';
import { FilterMode } from '../AnalysisListContainer.types';

interface EmptyStateProps {
  filter: FilterMode;
}

export const EmptyState = ({ filter }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {filter === 'today'
          ? 'No meals logged today'
          : 'No previous meals found'}
      </Text>
      {filter === 'today' && (
        <Text style={styles.subtitle}>
          Analyze a meal from the Home tab to see it here
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});

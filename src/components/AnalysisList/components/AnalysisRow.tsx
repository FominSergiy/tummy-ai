import { StyleSheet, Text, View } from 'react-native';
import { AnalysisHistoryItem } from '../../../services/api.service';

interface AnalysisRowProps {
  item: AnalysisHistoryItem;
}

export const AnalysisRow = ({ item }: AnalysisRowProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.mealTitle} numberOfLines={1}>
        {item.mealTitle || 'Untitled Meal'}
      </Text>
      <Text style={styles.calories}>
        {item.totalCalories !== null ? `${item.totalCalories} kcal` : '--'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  mealTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  calories: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

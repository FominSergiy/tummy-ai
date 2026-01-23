import { StyleSheet, Text, View } from 'react-native';

interface DateDividerProps {
  date: string;
}

export const DateDivider = ({ date }: DateDividerProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{date}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    marginVertical: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    paddingRight: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
});

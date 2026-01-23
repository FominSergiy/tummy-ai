import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const LoadingFooter = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

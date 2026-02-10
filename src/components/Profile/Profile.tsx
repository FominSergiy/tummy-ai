import { useAuth } from '@/src/providers';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProfileContainer = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace('/login');
  }, [logout, router]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    marginTop: 'auto',
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export { ProfileContainer };

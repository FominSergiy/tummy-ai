import { useAuth } from '@/src/providers';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function LogOut() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <View></View>;
}

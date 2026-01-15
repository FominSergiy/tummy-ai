import { Redirect } from 'expo-router';
import { useAuth } from '../providers';

export default function Index() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href={'/(tabs)/home'} />;
  }
  return <Redirect href={'/login'} />;
}

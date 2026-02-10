import { useAuth } from '@/src/providers';
import { Redirect } from 'expo-router';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Redirect href={'/login'} />;
  return <>{children}</>;
};

export { ProtectedRoute };

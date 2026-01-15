import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiService, LoginRequest } from '../services/api.service';
import { TokenStorage } from '../services/tokenStorage.service';

interface User {
  userId: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeJwtPayload = (token: string): User | null => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    return {
      userId: payload.userId,
      email: payload.email,
    };
  } catch {
    return null;
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const token = await TokenStorage.getToken();
      if (token) {
        const decoded = decodeJwtPayload(token);
        setUser(decoded);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await apiService.login(credentials);
    if (response.success && response.jwt) {
      const decoded = decodeJwtPayload(response.jwt);
      setUser(decoded);
    }
  }, []);

  const logout = useCallback(async () => {
    await TokenStorage.removeToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };

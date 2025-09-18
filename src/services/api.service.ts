import { TokenStorage } from './tokenStorage.service';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  jwt: string;
}

export interface ApiError {
  error: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    requiresAuth: boolean = false
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add JWT token to headers for protected routes
    if (requiresAuth) {
      const token = await TokenStorage.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      } else {
        throw new Error('Authentication required. Please log in again.');
      }
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle unauthorized responses
        if (response.status === 401) {
          await TokenStorage.removeToken();
          throw new Error('Session expired. Please log in again.');
        }

        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong!');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async signup(data: SignupRequest): Promise<SignupResponse> {
    return this.makeRequest<SignupResponse>('/signup', 'POST', data);
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>(
      '/login',
      'POST',
      data
    );

    // Store JWT token after successful login
    if (response.success && response.jwt) {
      await TokenStorage.storeToken(response.jwt);
    }

    return response;
  }

  async logout(): Promise<void> {
    await TokenStorage.removeToken();
  }

  async isAuthenticated(): Promise<boolean> {
    return await TokenStorage.hasToken();
  }

  // Example protected endpoint
  async getProfile(): Promise<any> {
    return this.makeRequest('/profile', 'GET', undefined, true);
  }

  // Helper method for making authenticated requests
  async makeAuthenticatedRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, method, data, true);
  }
}

export const apiService = new ApiService();

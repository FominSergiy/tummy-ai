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
    data?: any
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
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
    return this.makeRequest<LoginResponse>('/login', 'POST', data);
  }
}

export const apiService = new ApiService();

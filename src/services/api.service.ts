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

export interface AnalysisHistoryItem {
  id: number;
  mealTitle: string | null;
  totalCalories: number | null;
  committedAt: string | null;
}

export interface AnalysisHistoryResponse {
  success: boolean;
  data: AnalysisHistoryItem[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
  requiresAuth?: boolean;
}

interface FormDataFile {
  uri: string;
  name: string;
  type: string;
}

class ApiService {
  /**
   * Low-level fetch wrapper - returns raw Response for route-specific handling
   */
  private fetchApi = async (
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<Response> => {
    const { method = 'GET', data, requiresAuth = false } = options;
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      headers.Authorization = await this.getAuthString();
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    return fetch(url, config);
  };

  /**
   * Low-level fetch wrapper for FormData uploads
   */
  private fetchFormData = async (
    endpoint: string,
    file: FormDataFile,
    requiresAuth: boolean = false,
    additionalFields?: Record<string, string>
  ): Promise<Response> => {
    const url = `${API_BASE_URL}${endpoint}`;

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);

    // Append additional fields
    if (additionalFields) {
      Object.entries(additionalFields).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });
    }

    const headers: Record<string, string> = {};

    if (requiresAuth) {
      headers.Authorization = await this.getAuthString();
    }

    return fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
  };

  /**
   * Parse error message from failed response
   */
  private parseErrorResponse = async (response: Response): Promise<string> => {
    const errorData = await response.json().catch(() => ({}));
    return errorData.error || response.statusText || 'Something went wrong!';
  };

  /**
   * Get auth header string
   */
  private getAuthString = async (): Promise<string> => {
    const token = await TokenStorage.getToken();
    if (token) {
      return `Bearer ${token}`;
    }
    throw new Error('Authentication required. Please log in again.');
  };

  // ============ Route Methods ============

  signup = async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await this.fetchApi('/signup', { method: 'POST', data });

    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      // Route-specific: could handle 409 (user exists) differently here
      throw new Error(error);
    }

    return response.json();
  };

  login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await this.fetchApi('/login', { method: 'POST', data });

    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      // Route-specific: 401 here means wrong credentials, not expired token
      throw new Error(error);
    }

    const result: LoginResponse = await response.json();

    // Store JWT token after successful login
    if (result.success && result.jwt) {
      await TokenStorage.storeToken(result.jwt);
    }

    return result;
  };

  /**
   * Upload file with multipart/form-data
   */
  uploadFile = async <T>(
    endpoint: string,
    fileUri: string,
    fileName: string,
    mimeType: string = 'image/jpeg',
    requiresAuth: boolean = false,
    userPrompt?: string
  ): Promise<T> => {
    const additionalFields = userPrompt ? { prompt: userPrompt } : undefined;
    const response = await this.fetchFormData(
      endpoint,
      { uri: fileUri, name: fileName, type: mimeType },
      requiresAuth,
      additionalFields
    );

    if (!response.ok) {
      if (response.status === 401) {
        await TokenStorage.removeToken();
      }

      const error = await this.parseErrorResponse(response);
      throw new Error(error);
    }

    return response.json();
  };

  // ============ Ingredients API Methods ============

  /**
   * Commit an analysis (save permanently)
   */
  commitAnalysis = async (
    analysisId: number,
    overrides?: { mealTitle?: string; mealDescription?: string }
  ): Promise<{ success: boolean; analysisId: number; message: string }> => {
    const response = await this.fetchApi('/ingredients/commit', {
      method: 'POST',
      data: { analysisId, overrides },
      requiresAuth: true,
    });

    if (!response.ok) {
      if (response.status === 401) {
        await TokenStorage.removeToken();
      }
      const error = await this.parseErrorResponse(response);
      throw new Error(error);
    }

    return response.json();
  };

  /**
   * Decline an analysis (reject and cleanup)
   */
  declineAnalysis = async (
    analysisId: number,
    reason?: string
  ): Promise<{ success: boolean; analysisId: number; message: string }> => {
    const response = await this.fetchApi('/ingredients/decline', {
      method: 'POST',
      data: { analysisId, reason },
      requiresAuth: true,
    });

    if (!response.ok) {
      if (response.status === 401) {
        await TokenStorage.removeToken();
      }
      const error = await this.parseErrorResponse(response);
      throw new Error(error);
    }

    return response.json();
  };

  /**
   * Fetch paginated analysis history
   */
  getAnalysisHistory = async (
    filter: 'today' | 'historical' = 'today',
    cursor?: string,
    limit: number = 10
  ): Promise<AnalysisHistoryResponse> => {
    const params = new URLSearchParams({ filter, limit: String(limit) });
    if (cursor !== undefined) {
      params.append('cursor', String(cursor));
    }

    const response = await this.fetchApi(
      `/ingredients/history?${params.toString()}`,
      {
        method: 'GET',
        requiresAuth: true,
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        await TokenStorage.removeToken();
      }
      const error = await this.parseErrorResponse(response);
      throw new Error(error);
    }

    return response.json();
  };

  /**
   * Re-analyze with user-provided edits/hints
   */
  reanalyzeWithEdits = async <T>(
    analysisId: number,
    userEdits: {
      mealTitle?: string;
      mealDescription?: string;
      additionalContext?: string;
    }
  ): Promise<T> => {
    const response = await this.fetchApi('/ingredients/reanalyze', {
      method: 'POST',
      data: { analysisId, userEdits },
      requiresAuth: true,
    });

    if (!response.ok) {
      if (response.status === 401) {
        await TokenStorage.removeToken();
      }
      const error = await this.parseErrorResponse(response);
      throw new Error(error);
    }

    return response.json();
  };
}

export const apiService = new ApiService();

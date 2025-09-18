import { apiService } from './api.service';
import { TokenStorage } from './tokenStorage.service';

export class AuthService {
  static async logout(): Promise<void> {
    await apiService.logout();
  }

  static async isAuthenticated(): Promise<boolean> {
    return await apiService.isAuthenticated();
  }

  static async getStoredToken(): Promise<string | null> {
    return await TokenStorage.getToken();
  }

  static async clearSession(): Promise<void> {
    await TokenStorage.removeToken();
  }
}

export const authService = AuthService;

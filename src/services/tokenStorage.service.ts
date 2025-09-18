import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'user_jwt_token';

export class TokenStorage {
  static async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw new Error('Failed to store authentication token');
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      throw new Error('Failed to remove authentication token');
    }
  }

  static async hasToken(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null && token.length > 0;
  }
}

// src/services/storage.ts
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'refresh_token';

export const TokenStorage = {
    // Refresh token'ı güvenli bir şekilde saklar
    saveRefreshToken: async (token: string): Promise<void> => {
        try {
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
        } catch (error) {
            console.error('Refresh token kaydedilemedi:', error);
            throw error;
        }
    },

    // Saklanan refresh token'ı alır
    getRefreshToken: async (): Promise<string | null> => {
        try {
            return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Refresh token alınamadı:', error);
            return null;
        }
    },

    // Refresh token'ı siler (çıkış yaparken)
    removeRefreshToken: async (): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Refresh token silinemedi:', error);
            throw error;
        }
    }
};

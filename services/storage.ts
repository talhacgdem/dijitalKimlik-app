// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'refresh_token';

export const TokenStorage = {
    saveRefreshToken: async (token: string): Promise<void> => {
        try {
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
        } catch (error) {
            console.error('Refresh token kaydedilemedi:', error);
            throw error;
        }
    },

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

// Generic Storage Class
class GenericStorage {
    static KEY_CONTENT_TYPE = "content_types";

    /**
     * Herhangi bir objeyi storage'e kaydet
     * Date objelerini otomatik olarak serialize eder
     */
    static async setItem<T extends SerializableValue>(key: string, value: T): Promise<void> {
        try {
            const serializedValue = this.serialize(value);
            await AsyncStorage.setItem(key, JSON.stringify(serializedValue));
        } catch (error) {
            console.error(`Storage setItem error for key "${key}":`, error);
            throw error;
        }
    }

    /**
     * Storage'den objeyi oku ve deserialize et
     * Date string'lerini otomatik olarak Date objesine çevirir
     */
    static async getItem<T extends SerializableValue>(key: string): Promise<T | null> {
        try {
            const data = await AsyncStorage.getItem(key);

            if (data === null) {
                return null;
            }

            const parsedData = JSON.parse(data);
            return this.deserialize(parsedData) as T;
        } catch (error) {
            console.error(`Storage getItem error for key "${key}":`, error);
            return null;
        }
    }

    /**
     * Storage'den item'ı sil
     */
    static async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(`Storage removeItem error for key "${key}":`, error);
            throw error;
        }
    }

    /**
     * Storage'i tamamen temizle
     */
    static async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Storage clear error:', error);
            throw error;
        }
    }

    /**
     * Objeyi serialize et (Date objelerini string'e çevir)
     */
    private static serialize(value: SerializableValue): any {
        if (value === null || value === undefined) {
            return value;
        }

        if (value instanceof Date) {
            return {
                __type: 'Date',
                __value: value.toISOString()
            };
        }

        if (Array.isArray(value)) {
            return value.map(item => this.serialize(item));
        }

        if (typeof value === 'object') {
            const serialized: any = {};
            for (const [key, val] of Object.entries(value)) {
                serialized[key] = this.serialize(val);
            }
            return serialized;
        }

        return value;
    }

    /**
     * Objeyi deserialize et (Date string'lerini Date objesine çevir)
     */
    private static deserialize(value: any): SerializableValue {
        if (value === null || value === undefined) {
            return value;
        }

        // Date objesi kontrolü
        if (typeof value === 'object' && value.__type === 'Date') {
            return new Date(value.__value);
        }

        if (Array.isArray(value)) {
            return value.map(item => this.deserialize(item));
        }

        if (typeof value === 'object') {
            const deserialized: any = {};
            for (const [key, val] of Object.entries(value)) {
                deserialized[key] = this.deserialize(val);
            }
            return deserialized;
        }

        return value;
    }
}

// Supported primitive types
type Primitive = string | number | boolean | null | undefined;

// Date handling için özel tip
type SerializableValue =
    | Primitive
    | Date
    | SerializableValue[]
    | { [key: string]: SerializableValue };


export { GenericStorage };

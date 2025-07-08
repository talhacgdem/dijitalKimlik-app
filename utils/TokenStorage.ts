import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserDto} from "@/types/AuthDto";

const TOKEN_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    LOGIN_TIME: 'loginTime',
    USER_DATA: 'userData'
};

const TokenStorage = {
    // Token kaydetme
    async saveTokens(accessToken: string, refreshToken: string, userData?: UserDto) {
        try {
            // AsyncStorage.multiSet için doğru tip yapısını kullan
            const items: [string, string][] = [
                [TOKEN_KEYS.ACCESS_TOKEN, accessToken],
                [TOKEN_KEYS.LOGIN_TIME, Date.now().toString()]
            ];
            
            if (refreshToken) {
                items.push([TOKEN_KEYS.REFRESH_TOKEN, refreshToken]);
            }

            if (userData) {
                items.push([TOKEN_KEYS.USER_DATA, JSON.stringify(userData)]);
            }
            
            await AsyncStorage.multiSet(items);
            console.log('✅ Token kaydedildi');
        } catch (error) {
            console.error('❌ Token kaydetme hatası:', error);
        }
    },

    // Token alma
    async getTokens() {
        try {
            const values = await AsyncStorage.multiGet([
                TOKEN_KEYS.ACCESS_TOKEN,
                TOKEN_KEYS.REFRESH_TOKEN,
                TOKEN_KEYS.LOGIN_TIME,
                TOKEN_KEYS.USER_DATA
            ]);

            return {
                accessToken: values[0][1],
                refreshToken: values[1][1],
                loginTime: values[2][1],
                userData: values[3][1]
            };
        } catch (error) {
            console.error('❌ Token alma hatası:', error);
            return null;
        }
    },

    // Token silme
    async clearTokens() {
        try {
            await AsyncStorage.multiRemove([
                TOKEN_KEYS.ACCESS_TOKEN, 
                TOKEN_KEYS.REFRESH_TOKEN, 
                TOKEN_KEYS.LOGIN_TIME,
                TOKEN_KEYS.USER_DATA
            ]);
            console.log('✅ Token temizlendi');
        } catch (error) {
            console.error('❌ Token temizleme hatası:', error);
        }
    },
    
    // Token geçerliliğini kontrol et
    async isTokenValid() {
        try {
            const tokens = await this.getTokens();
            if (!tokens?.accessToken || !tokens?.loginTime) {
                return false;
            }
            
            // Token süresi doldu mu kontrol et (varsayılan 24 saat)
            const loginTime = parseInt(tokens.loginTime || '0', 10);
            const now = Date.now();
            const tokenDuration = 24 * 60 * 60 * 1000; // 24 saat
            
            return now - loginTime < tokenDuration;
        } catch (error) {
            console.error(error)
            return false;
        }
    }
};

export default TokenStorage;
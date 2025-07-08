import React, {createContext, useContext, useEffect, useState} from 'react';
import {apiClient} from '@/services/api/client';
import {TokenStorage} from '@/services/storage';
import { UserDto } from '@/types/AuthDto';

interface AuthContextType {
    user: UserDto | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Uygulama başladığında refresh token ile oturum kontrolü
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const refreshToken = await TokenStorage.getRefreshToken();

                console.log("refresh token: ", refreshToken)
                if (refreshToken) {
                    // Refresh token varsa, yeni access token al
                    const authData = await apiClient.refreshAccessToken(refreshToken);

                    if (authData) {
                        // Başarılı ise kullanıcı bilgilerini ayarla
                        apiClient.setAccessToken(authData.access_token);
                        await TokenStorage.saveRefreshToken(authData.refresh_token);
                        setUser(authData.user);
                        setIsAuthenticated(true);
                        console.log("başarılı",isAuthenticated, user)
                    } else {
                        // Refresh token geçersiz, oturumu temizle
                        await TokenStorage.removeRefreshToken();
                        setIsAuthenticated(false);
                    }
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Oturum kontrolü hatası:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth().then(() => console.log(isAuthenticated, user));
    }, []);

    // Login fonksiyonu
    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await apiClient.login(username, password);
            setUser(response.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Giriş hatası:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout fonksiyonu
    const logout = async () => {
        setIsLoading(true);
        try {
            await apiClient.logout();
        } catch (error) {
            console.error('Çıkış hatası:', error);
        } finally {
            // Yerel oturum verilerini temizle
            apiClient.clearAccessToken();
            await TokenStorage.removeRefreshToken();
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{user, isLoading, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

import React, {createContext, useContext, useEffect, useState} from 'react';
import {apiClient} from '@/services/api/client';
import {TokenStorage} from '@/services/storage';
import { UserDto } from '@/types/AuthDto';
import {toastManager} from "@/services/ToastManager";

interface AuthContextType {
    user: UserDto | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin:boolean
    isEmailVerified:boolean
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isEmailVerified, setEmailVerified] = useState<boolean>(false);



    // Uygulama başladığında refresh token ile oturum kontrolü
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const refreshToken = await TokenStorage.getRefreshToken();

                if (refreshToken) {
                    // Refresh token varsa, yeni access token al
                    const authData = await apiClient.refreshAccessToken(refreshToken);

                    if (authData) {
                        // Başarılı ise kullanıcı bilgilerini ayarla
                        apiClient.setAccessToken(authData.data.access_token, authData.data.expires_in);
                        await TokenStorage.saveRefreshToken(authData.data.refresh_token);
                        setUser(authData.data.user);
                        setIsAuthenticated(true);
                        setIsAdmin(authData.data.user.user_type === 'admin');
                        setEmailVerified(authData.data.user.email_verified);
                        console.log('USER ------------------ ', authData);
                    } else {
                        // Refresh token geçersiz, oturumu temizle
                        await TokenStorage.removeRefreshToken();
                        setIsAuthenticated(false);
                        setIsAdmin(false);
                    }
                } else {
                    setIsAuthenticated(false);
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Oturum kontrolü hatası:', error);
                setIsAuthenticated(false);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login fonksiyonu
    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await apiClient.login(username, password);
            setUser(response.data.user);
            setIsAuthenticated(true);
            setIsAdmin(response.data.user.user_type === 'admin');
        } catch (error) {
            console.error('Giriş hatası:', error);
            toastManager.error('Hatalı kimlik veya şifre', {
                duration: 10000,
                position: 'bottom',
            });
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
            setIsAdmin(false);
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{user, isLoading, isAuthenticated, isAdmin, isEmailVerified, login, logout}}>
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

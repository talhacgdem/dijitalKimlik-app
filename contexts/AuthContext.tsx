// contexts/AuthContext.tsx
import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {apiClient} from '@/services/api/client';
import {TokenStorage} from '@/services/storage';
import { UserDto } from '@/types/AuthDto';
import {toastManager} from "@/services/ToastManager";
import {useGlobalLoading} from "@/contexts/LoadingContext";

interface AuthContextType {
    user: UserDto | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isEmailVerified: boolean;
    login: (username: string, password: string) => Promise<{success: boolean, emailVerified: boolean}>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAuthenticated: false,
    isAdmin: false,
    isEmailVerified: false,
    login: async () => ({success: false, emailVerified: false}),
    logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [internalLoading, setInternalLoading] = useState(true); // Kendi loading state'i
    const {showLoading, hideLoading} = useGlobalLoading();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isEmailVerified, setEmailVerified] = useState<boolean>(false);
    const hasCheckedAuth = useRef(false);

    useEffect(() => {
        if (hasCheckedAuth.current) {
            return;
        }

        const checkAuth = async () => {
            hasCheckedAuth.current = true;
            setInternalLoading(true);

            try {
                const refreshToken = await TokenStorage.getRefreshToken();

                if (refreshToken) {
                    console.log('🔍 Refresh token bulundu, token yenileniyor...');
                    const authData = await apiClient.refreshAccessToken(refreshToken);

                    if (authData?.success && authData.data) {
                        apiClient.setAccessToken(authData.data.access_token, authData.data.expires_in);
                        await TokenStorage.saveRefreshToken(authData.data.refresh_token);
                        setUser(authData.data.user);
                        setIsAuthenticated(true);
                        setIsAdmin(authData.data.user.user_type === 'admin');
                        setEmailVerified(authData.data.user?.email_verified || false);
                    } else {
                        await clearAuthState();
                    }
                } else {
                    console.log('ℹ️ Refresh token bulunamadı');
                    await clearAuthState();
                }
            } catch (error) {
                console.error('❌ Oturum kontrolü hatası:', error);
                await clearAuthState();
            } finally {
                setInternalLoading(false);
            }
        };

        checkAuth();
    }, []);

    const clearAuthState = async () => {
        await TokenStorage.removeRefreshToken();
        apiClient.clearAccessToken();
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setEmailVerified(false);
    };

    const login = async (username: string, password: string) => {
        showLoading("Giriş yapılıyor");
        try {
            const response = await apiClient.login(username, password);

            if (response.success && response.data) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                setIsAdmin(response.data.user.user_type === 'admin');
                setEmailVerified(response.data.user?.email_verified || false);

                return {
                    success: true,
                    emailVerified: response.data.user?.email_verified || false
                };
            }

            return { success: false, emailVerified: false };
        } catch (error) {
            console.error('Giriş hatası:', error);
            toastManager.error('Hatalı kimlik veya şifre');
            throw error;
        } finally {
            hideLoading();
        }
    };

    const logout = async () => {
        showLoading("Çıkış yapılıyor");
        try {
            await apiClient.logout();
        } catch (error) {
            console.error('Çıkış hatası:', error);
        } finally {
            await clearAuthState();
            hideLoading();
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading: internalLoading, // Global loading yerine internal loading kullan
            isAuthenticated,
            isAdmin,
            isEmailVerified,
            login,
            logout
        }}>
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
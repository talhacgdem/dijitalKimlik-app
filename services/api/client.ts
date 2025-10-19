// src/services/api/client.ts
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import {TokenStorage} from '../storage';
import {BASE_API_URL} from './Endpoints';
import {toastManager} from '../ToastManager';
import {Alert} from 'react-native';
import {AuthResponse} from "@/types/v2/Auth";
import {BaseModel} from "@/types/v2/Base";

// Hata callback tipi
type ErrorCallback = (error: AxiosError) => void;

class ApiClient {
    private readonly axiosInstance: AxiosInstance;
    private accessToken: string | null = null;
    private tokenExpiryTime: Date | null = null;
    private isRefreshing: boolean = false;
    private refreshSubscribers: ((token: string) => void)[] = [];
    private onUnauthorized?: () => void; // Login sayfasına yönlendirme callback'i
    private globalErrorHandler?: ErrorCallback; // Global hata handler

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: BASE_API_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    // Login sayfasına yönlendirme callback'ini ayarla
    setOnUnauthorized(callback: () => void): void {
        this.onUnauthorized = callback;
    }

    // Global hata handler'ı ayarla (opsiyonel, özel durumlar için)
    setGlobalErrorHandler(callback: ErrorCallback): void {
        this.globalErrorHandler = callback;
    }

    private setupInterceptors(): void {
        // İstek interceptor'ı
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                // Token süresini kontrol et ve gerekirse yenile
                await this.checkAndRefreshToken();

                console.info('🚀 REQUEST:', {
                    method: config.method?.toUpperCase(),
                    fullURL: `${config.baseURL}${config.url}`,
                    headers: config.headers,
                    data: config.data,
                });

                // Her istekte access token varsa ekle
                if (this.accessToken) {
                    config.headers.Authorization = `Bearer ${this.accessToken}`;
                }

                // İstek loglaması
                console.log(`API İsteği: ${config.method?.toUpperCase()} ${config.url}`);

                return config;
            },
            (error) => {
                console.error('İstek hatası:', error);
                return Promise.reject(error);
            }
        );

        // Yanıt interceptor'ı
        this.axiosInstance.interceptors.response.use(
            (response) => {
                // Yanıt loglaması
                console.log(`API Yanıtı: ${response.status} ${response.config.url}`);
                return response;
            },
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                // 401 hatası ve token yenileme denemesi yapılmamışsa
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    const refreshToken = await TokenStorage.getRefreshToken();
                    if (!refreshToken) {
                        // Refresh token yoksa login sayfasına yönlendir
                        this.redirectToLogin();
                        return Promise.reject(error);
                    }

                    const authResponse = await this.refreshAccessToken(refreshToken);
                    if (authResponse && authResponse.success) {
                        // Yeni token ile isteği tekrarla
                        this.setAccessToken(
                            authResponse.data.access_token,
                            authResponse.data.expires_in
                        );
                        await TokenStorage.saveRefreshToken(authResponse.data.refresh_token);

                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${authResponse.data.access_token}`;
                        }

                        return this.axiosInstance(originalRequest);
                    } else {
                        this.redirectToLogin();
                        return Promise.reject(error);
                    }
                }

                // Hata mesajını göster
                this.handleApiError(error);

                // Global error handler varsa çağır
                if (this.globalErrorHandler) {
                    this.globalErrorHandler(error);
                }

                return Promise.reject(error);
            }
        );
    }

    private handleApiError(error: AxiosError): void {
        let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        let showAlert = false;
        let alertDetails = '';

        if (error.response) {
            const data = error.response.data as BaseModel<any>;

            // Validation hatası kontrolü
            if (data.errors && data.errors.length > 0) {
                showAlert = true;
                errorMessage = data.message || 'Doğrulama hatası oluştu';
                alertDetails = data.errors.join('\n');
            } else {
                // Normal hata mesajı
                errorMessage = data.message || errorMessage;
            }
        } else if (error.request) {
            errorMessage = 'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.';
        }

        if (showAlert) {
            // Alert box ile detaylı hata göster
            Alert.alert("Hata", `${errorMessage}\n\nDetaylar:\n${alertDetails}`);
        } else {
            // Normal toast mesajı
            toastManager.error(errorMessage, {
                duration: 4000,
                position: 'bottom',
            });
        }
    }

    private redirectToLogin(): void {
        console.log('Oturum sonlandı, giriş sayfasına yönlendiriliyor...');
        this.clearAccessToken();
        TokenStorage.removeRefreshToken();

        if (this.onUnauthorized) {
            this.onUnauthorized();
        }
    }

    // Token süresini kontrol et ve gerekirse yenile
    private async checkAndRefreshToken(): Promise<void> {
        if (!this.tokenExpiryTime || !this.accessToken) {
            return;
        }

        const now = new Date().getTime();
        const expiryTime = this.tokenExpiryTime.getTime();

        // Token süresi 5 dakikadan az kaldıysa yenile
        if (expiryTime - now < 300000) {
            if (this.isRefreshing) {
                // Zaten yenileme işlemi devam ediyorsa, bekle
                return new Promise((resolve) => {
                    this.refreshSubscribers.push(() => {
                        resolve();
                    });
                });
            }

            this.isRefreshing = true;
            console.log('Token süresi dolmak üzere, yenileniyor...');

            const refreshToken = await TokenStorage.getRefreshToken();
            if (refreshToken) {
                const authResponse = await this.refreshAccessToken(refreshToken);
                if (authResponse && authResponse.success) {
                    this.setAccessToken(
                        authResponse.data.access_token,
                        authResponse.data.expires_in
                    );
                    await TokenStorage.saveRefreshToken(authResponse.data.refresh_token);

                    this.onTokenRefreshed(authResponse.data.access_token);
                    console.log('Token başarıyla yenilendi!');
                }
            }

            this.isRefreshing = false;
        }
    }

    private onTokenRefreshed(token: string): void {
        this.refreshSubscribers.forEach((callback) => callback(token));
        this.refreshSubscribers = [];
    }

    setAccessToken(token: string, expiresIn: number): void {
        this.accessToken = token;
        const expiryTime = new Date(Date.now() + expiresIn * 1000);
        this.tokenExpiryTime = expiryTime;

        console.log('Access token ayarlandı. Süre bitiş:', expiryTime.toISOString());
    }

    clearAccessToken(): void {
        this.accessToken = null;
        this.tokenExpiryTime = null;
    }

    async refreshAccessToken(refreshToken: string): Promise<AuthResponse | null> {
        try {
            const data = {refresh_token: refreshToken};

            console.log('Token yenileme isteği gönderiliyor');

            const response = await axios.post<AuthResponse>(
                `${BASE_API_URL}/auth/refresh-token`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                console.log('Token yenileme başarılı');
            }

            return response.data;
        } catch (error) {
            console.error('Token yenileme başarısız:', error);
            return null;
        }
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await this.axiosInstance.post<AuthResponse>('/auth/login', {
            email,
            password,
        });

        if (response.data.success) {
            this.setAccessToken(
                response.data.data.access_token,
                response.data.data.expires_in
            );
            await TokenStorage.saveRefreshToken(response.data.data.refresh_token);
            console.log('Login başarılı! Kullanıcı:', response.data.data.user.email);
        }

        return response.data;
    }

    async logout(): Promise<void> {
        await this.axiosInstance.post('/auth/logout');
        console.log('Logout başarılı! Tokenlar temizlendi.');
        this.clearAccessToken();
        await TokenStorage.removeRefreshToken();
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.patch<T>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }

    async postFormData<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, formData, {
            ...config,
            headers: {
            },
        });
        return response.data;
    }
}

export const apiClient = new ApiClient();

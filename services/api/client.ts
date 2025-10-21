// src/services/api/client.ts
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import {TokenStorage} from '../storage';
import {BASE_API_URL} from './Endpoints';
import {toastManager} from '../ToastManager';
import {Alert} from 'react-native';
import {AuthResponse} from "@/types/v2/Auth";
import {BaseModel} from "@/types/v2/Base";

type ErrorCallback = (error: AxiosError) => void;

class ApiClient {
    private readonly axiosInstance: AxiosInstance;
    private accessToken: string | null = null;
    private tokenExpiryTime: Date | null = null;
    private onUnauthorized?: () => void;
    private globalErrorHandler?: ErrorCallback;

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

    setOnUnauthorized(callback: () => void): void {
        this.onUnauthorized = callback;
    }

    setGlobalErrorHandler(callback: ErrorCallback): void {
        this.globalErrorHandler = callback;
    }

    private setupInterceptors(): void {
        // İstek interceptor'ı
        this.axiosInstance.interceptors.request.use(
            async (config) => {
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

                console.log(`API İsteği: ${config.method?.toUpperCase()} ${config.url}`);

                return config;
            },
            (error) => {
                console.error('İstek hatası:', error);
                return Promise.reject(error);
            }
        );

        // Yanıt interceptor'ı - SADELEŞTIRILDI
        this.axiosInstance.interceptors.response.use(
            (response) => {
                console.log(`API Yanıtı: ${response.status} ${response.config.url}`);
                return response;
            },
            async (error: AxiosError) => {
                // 401 hatası gelirse oturumu sonlandır
                if (error.response?.status === 401) {
                    console.log('❌ 401 Hatası - Oturum sonlandırılıyor');
                    this.redirectToLogin();
                    return Promise.reject(error);
                }

                // Diğer hataları göster
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

            if (data.errors && data.errors.length > 0) {
                showAlert = true;
                errorMessage = data.message || 'Doğrulama hatası oluştu';
                alertDetails = data.errors.join('\n');
            } else {
                errorMessage = data.message || errorMessage;
            }
        } else if (error.request) {
            errorMessage = 'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.';
        }

        if (showAlert) {
            Alert.alert("Hata", `${errorMessage}\n\nDetaylar:\n${alertDetails}`);
        } else {
            toastManager.error(errorMessage, {
                duration: 4000,
                position: 'bottom',
            });
        }
    }

    private redirectToLogin(): void {
        console.log('🚪 Oturum sonlandı, giriş sayfasına yönlendiriliyor...');
        this.clearAccessToken();
        TokenStorage.removeRefreshToken();

        if (this.onUnauthorized) {
            this.onUnauthorized();
        }
    }

    setAccessToken(token: string, expiresIn: number): void {
        this.accessToken = token;
        const expiryTime = new Date(Date.now() + expiresIn * 1000);
        this.tokenExpiryTime = expiryTime;

        console.log('✅ Access token ayarlandı. Süre bitiş:', expiryTime.toISOString());
    }

    clearAccessToken(): void {
        this.accessToken = null;
        this.tokenExpiryTime = null;
        console.log('🗑️ Access token temizlendi');
    }

    // Token'ın süresi dolmuş mu kontrol et
    isTokenExpired(): boolean {
        if (!this.tokenExpiryTime) {
            return true;
        }
        return new Date().getTime() >= this.tokenExpiryTime.getTime();
    }

    async refreshAccessToken(refreshToken: string): Promise<AuthResponse | null> {
        try {
            const data = {refresh_token: refreshToken};

            console.log('🔄 Token yenileme isteği gönderiliyor...');

            // Direkt axios kullan, interceptor'dan kaç
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

            if (response.data && response.data.success) {
                console.log('✅ Token yenileme başarılı');
                return response.data;
            } else {
                console.log('❌ Token yenileme başarısız: response.data.success = false');
                return null;
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('❌ Token yenileme hatası:', error.response?.status, error.message);
            } else {
                console.error('❌ Token yenileme hatası:', error);
            }
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
            console.log('✅ Login başarılı! Kullanıcı:', response.data.data.user.email);
        }

        return response.data;
    }

    async logout(): Promise<void> {
        try {
            await this.axiosInstance.get('/auth/logout');
            console.log('✅ Logout başarılı!');
        } catch (error) {
            console.log('⚠️ Logout API hatası (önemsiz)');
        } finally {
            this.clearAccessToken();
            await TokenStorage.removeRefreshToken();
        }
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
            timeout: 60000,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            },
        });
        return response.data;
    }
}

export const apiClient = new ApiClient();
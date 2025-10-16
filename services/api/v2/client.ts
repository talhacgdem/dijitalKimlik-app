// src/services/api/client.ts
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, isAxiosError} from 'axios';
import {TokenStorage} from '../../storage';
import {BASE_API_URL} from './../Endpoints';
import {toastManager} from '../../ToastManager';
import {Alert} from 'react-native';
import {AuthResponse} from "@/types/v2/Auth";
import {BaseModel} from "@/types/v2/Base";

class ApiClient {
    private readonly axiosInstance: AxiosInstance;
    private accessToken: string | null = null;
    private tokenExpiryTime: Date | null = null;
    private isRefreshing: boolean = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

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

    private setupInterceptors(): void {
        // İstek interceptor'ı
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                // Token süresini kontrol et ve gerekirse yenile
                await this.checkAndRefreshToken();

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

                    try {
                        // Refresh token ile yeni access token al
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
                        }
                    } catch (refreshError) {
                        console.error('Token yenileme hatası:', refreshError);
                        this.redirectToLogin();
                        return Promise.reject(refreshError);
                    }
                }

                // Hata mesajını göster
                this.handleApiError(error);
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
        // Bu fonksiyon AuthContext'ten inject edilebilir
    }

    // Token süresini kontrol et ve gerekirse yenile (Postman'deki prerequest script mantığı)
    private async checkAndRefreshToken(): Promise<void> {
        if (!this.tokenExpiryTime || !this.accessToken) {
            return;
        }

        const now = new Date().getTime();
        const expiryTime = this.tokenExpiryTime.getTime();

        // Token süresi 5 dakikadan az kaldıysa yenile (300000ms = 5 dakika)
        if (expiryTime - now < 300000) {
            if (this.isRefreshing) {
                // Zaten yenileme işlemi devam ediyorsa, bekle
                return new Promise((resolve) => {
                    this.refreshSubscribers.push((token: string) => {
                        resolve();
                    });
                });
            }

            this.isRefreshing = true;
            console.log('Token süresi dolmak üzere, yenileniyor...');

            try {
                const refreshToken = await TokenStorage.getRefreshToken();
                if (refreshToken) {
                    const authResponse = await this.refreshAccessToken(refreshToken);
                    if (authResponse && authResponse.success) {
                        this.setAccessToken(
                            authResponse.data.access_token,
                            authResponse.data.expires_in
                        );
                        await TokenStorage.saveRefreshToken(authResponse.data.refresh_token);

                        // Bekleyen istekleri bilgilendir
                        this.onTokenRefreshed(authResponse.data.access_token);
                        console.log('Token başarıyla yenilendi!');
                    }
                }
            } catch (error) {
                console.error('Otomatik token yenileme hatası:', error);
            } finally {
                this.isRefreshing = false;
            }
        }
    }

    private onTokenRefreshed(token: string): void {
        this.refreshSubscribers.forEach((callback) => callback(token));
        this.refreshSubscribers = [];
    }

    // Access token ayarla (bellek üzerinde) ve expiry time hesapla
    setAccessToken(token: string, expiresIn: number): void {
        this.accessToken = token;
        // expires_in saniye cinsinden gelir, milisaniyeye çevir
        const expiryTime = new Date(Date.now() + expiresIn * 1000);
        this.tokenExpiryTime = expiryTime;

        console.log('Access token ayarlandı. Süre bitiş:', expiryTime.toISOString());
    }

    // Access token temizle
    clearAccessToken(): void {
        this.accessToken = null;
        this.tokenExpiryTime = null;
    }

    // Refresh token ile yeni access token al
    async refreshAccessToken(refreshToken: string): Promise<AuthResponse | null> {
        try {
            const data = {refresh_token: refreshToken};

            console.log('Token yenileme isteği gönderiliyor:', `${BASE_API_URL}/auth/refresh-token`);

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
                console.log('Token yenileme başarılı:', {
                    accessTokenLength: response.data.data.access_token.length,
                    refreshTokenLength: response.data.data.refresh_token.length,
                    expiresIn: response.data.data.expires_in
                });
            }

            return response.data;
        } catch (error) {
            console.error('Token yenileme başarısız:', error);
            toastManager.error("Oturum süresi doldu. Lütfen tekrar giriş yapın.", {
                duration: 4000,
                position: 'bottom',
            });

            if (isAxiosError(error)) {
                console.error('Hata detayları:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data
                });
            }

            return null;
        }
    }

    // Login işlemi
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await this.axiosInstance.post<AuthResponse>('/auth/login', {
            email,
            password,
        });

        if (response.data.success) {
            // Access token'ı belleğe kaydet ve expiry time'ı hesapla
            this.setAccessToken(
                response.data.data.access_token,
                response.data.data.expires_in
            );

            // Refresh token'ı güvenli depolamaya kaydet
            await TokenStorage.saveRefreshToken(response.data.data.refresh_token);

            // Kullanıcı bilgilerini de kaydedebilirsiniz
            console.log('Login başarılı! Kullanıcı:', response.data.data.user.email);
        }

        return response.data;
    }

    // Register işlemi
    async register(data: {
        email: string;
        password: string;
        password_confirmation: string;
        name: string;
        phone: string;
        job: string;
    }): Promise<AuthResponse> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await this.axiosInstance.post<AuthResponse>(
            '/auth/register',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (response.data.success) {
            console.log('Kayıt başarılı! Email doğrulama gerekiyor.');
        }

        return response.data;
    }

    // Email doğrulama
    async verifyEmail(token: string): Promise<BaseModel<any>> {
        const response = await this.axiosInstance.get<BaseModel<any>>(
            `/auth/verify-email?token=${token}`
        );
        return response.data;
    }

    // Şifre sıfırlama isteği
    async forgotPassword(email: string): Promise<BaseModel<any>> {
        const response = await this.axiosInstance.post<BaseModel<any>>(
            '/auth/forgot-password',
            {email}
        );
        return response.data;
    }

    // Şifre sıfırlama
    async resetPassword(data: {
        token: string;
        password: string;
        password_confirmation: string;
    }): Promise<BaseModel<any>> {
        const response = await this.axiosInstance.post<BaseModel<any>>(
            '/auth/reset-password',
            data
        );
        return response.data;
    }

    // Mevcut kullanıcı bilgilerini al
    async getCurrentUser(): Promise<BaseModel<any>> {
        const response = await this.axiosInstance.get<BaseModel<any>>('/auth/me');
        return response.data;
    }

    // Çıkış işlemi
    async logout(): Promise<void> {
        try {
            // Sunucuya çıkış isteği gönder
            await this.axiosInstance.post('/auth/logout');
            console.log('Logout başarılı! Tokenlar temizlendi.');
        } catch (error) {
            console.error('Çıkış hatası:', error);
        } finally {
            // Yerel tokenları temizle
            this.clearAccessToken();
            await TokenStorage.removeRefreshToken();
        }
    }

    // Profil güncelleme
    async updateProfile(data: {
        email?: string;
        phone?: string;
        name?: string;
        job?: string;
    }): Promise<BaseModel<any>> {
        const response = await this.axiosInstance.put<BaseModel<any>>(
            '/profile',
            data
        );
        return response.data;
    }

    // Genel GET isteği
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, config);
        return response.data;
    }

    // Genel POST isteği
    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    // Genel PUT isteği
    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    // Genel PATCH isteği
    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.patch<T>(url, data, config);
        return response.data;
    }

    // Genel DELETE isteği
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }

    // FormData ile POST isteği (resim yükleme için)
    async postFormData<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, formData, {
            ...config,
            headers: {
                ...config?.headers,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}

// Singleton instance
export const apiClient = new ApiClient();

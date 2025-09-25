// src/services/api/client.ts
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, isAxiosError} from 'axios';
import {TokenStorage} from '../storage';
import {LoginResponseDTO} from "@/types/AuthDto";
import {BASE_API_URL} from './Endpoints';
import {toastManager} from '../ToastManager';
import {BaseResponse} from "@/types/baseTypes";
import {Alert} from 'react-native';

// API URL'leri // Örnek URL, gerçek URL ile değiştirilmeli

class ApiClient {
    private readonly axiosInstance: AxiosInstance;
    private accessToken: string | null = null;

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

                        const response = await this.refreshAccessToken(refreshToken);
                        if (response) {
                            // Yeni token ile isteği tekrarla
                            this.setAccessToken(response.access_token);
                            await TokenStorage.saveRefreshToken(response.refresh_token);

                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
                            }

                            return this.axiosInstance(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error('Token yenileme hatası:', refreshError);
                        // Token yenileme başarısız, login sayfasına yönlendir
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
            const data = error.response.data as BaseResponse;

            // Validation hatası kontrolü
            if (data.errors && Object.keys(data.errors).length > 0) {
                showAlert = true;
                errorMessage = data.message || 'Doğrulama hatası oluştu';

                // Hata detaylarını formatla
                const errorDetails: string[] = [];
                Object.entries(data.errors).forEach(([field, messages]) => {
                    messages.forEach(message => {
                        errorDetails.push(`${field}: ${message}`);
                    });
                });

                alertDetails = errorDetails.join('\n');
            } else {
                // Normal hata mesajı
                errorMessage = data.message || errorMessage;
            }
        } else if (error.request) {
            errorMessage = 'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.';
        }

        if (showAlert) {
            // Alert box ile detaylı hata göster
            Alert.alert("Hata",`${errorMessage}\n\nDetaylar:\n${alertDetails}`);
        } else {
            // Normal toast mesajı
            toastManager.error(errorMessage, {
                duration: 4000,
                position: 'bottom',
            });
        }
    }

    private redirectToLogin(): void {
        // Global state veya navigation ile login sayfasına yönlendirme
        // Bu fonksiyon, AuthContext içerisinden inject edilebilir
        console.log('Oturum sonlandı, giriş sayfasına yönlendiriliyor...');
        // Örnek: navigation.navigate('Login')
    }

    // Access token ayarla (bellek üzerinde)
    setAccessToken(token: string): void {
        this.accessToken = token;
    }

    // Access token temizle
    clearAccessToken(): void {
        this.accessToken = null;
    }

    // Refresh token ile yeni access token al
    async refreshAccessToken(refreshToken: string): Promise<LoginResponseDTO | null> {
        try {
            let data = {refresh_token: refreshToken}

            console.log('Token yenileme isteği gönderiliyor:', `${BASE_API_URL}/auth/refresh`);

            const response = await axios.post<LoginResponseDTO>(
                `${BASE_API_URL}/auth/refresh`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Token yenileme başarılı:', {
                accessTokenLength: response.data.access_token.length,
                refreshTokenLength: response.data.refresh_token.length,
                expiresIn: response.data.expires_in
            });

            return response.data;
        } catch (error) {
            console.error('Token yenileme başarısız:', error);
            toastManager.error("Oturum süresi doldu. Lütfen tekrar giriş yapın.", {
                duration: 4000,
                position: 'bottom',
            })

            // Daha detaylı hata loglaması
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
    async login(username: string, password: string): Promise<LoginResponseDTO> {
        const response = await this.axiosInstance.post<LoginResponseDTO>(BASE_API_URL + '/auth/login', {
            email: username,
            password: password,
        });

        // Access token'ı belleğe kaydet
        this.setAccessToken(response.data.access_token);

        // Refresh token'ı güvenli depolamaya kaydet
        await TokenStorage.saveRefreshToken(response.data.refresh_token);

        return response.data;
    }

    // Çıkış işlemi
    async logout(): Promise<void> {
        try {
            // Sunucuya çıkış isteği gönder
            await this.axiosInstance.get(BASE_API_URL + '/auth/logout');
        } catch (error) {
            console.error('Çıkış hatası:', error);
        } finally {
            // Yerel tokenları temizle
            this.clearAccessToken();
            await TokenStorage.removeRefreshToken();
        }
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
    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.patch<T>(url, data, config);
        return response.data;
    }

    // Genel DELETE isteği
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }
}

// Singleton instance
export const apiClient = new ApiClient();

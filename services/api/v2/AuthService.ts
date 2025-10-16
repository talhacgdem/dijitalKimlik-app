// src/services/api/services/AuthService.ts
import {AuthResponse} from '@/types/v2/Auth';
import {BaseModel} from '@/types/v2/Base';
import {apiClient} from "@/services/api/v2/client";

export class AuthService {
    static async login(email: string, password: string): Promise<AuthResponse> {
        return apiClient.login(email, password);
    }

    static async register(data: {
        email: string;
        password: string;
        password_confirmation: string;
        name: string;
        phone: string;
        job: string;
    }): Promise<AuthResponse> {
        return apiClient.register(data);
    }

    static async logout(): Promise<void> {
        return apiClient.logout();
    }

    static async getCurrentUser(): Promise<BaseModel<any>> {
        return apiClient.getCurrentUser();
    }

    static async verifyEmail(token: string): Promise<BaseModel<any>> {
        return apiClient.verifyEmail(token);
    }

    static async forgotPassword(email: string): Promise<BaseModel<any>> {
        return apiClient.forgotPassword(email);
    }

    static async resetPassword(data: {
        token: string;
        password: string;
        password_confirmation: string;
    }): Promise<BaseModel<any>> {
        return apiClient.resetPassword(data);
    }

    static async updateProfile(data: {
        email?: string;
        phone?: string;
        name?: string;
        job?: string;
    }): Promise<BaseModel<any>> {
        return apiClient.updateProfile(data);
    }
}

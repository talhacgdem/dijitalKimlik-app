// src/services/api/services/AuthService.ts
import {AuthResponse} from '@/types/v2/Auth';
import {BaseModel} from '@/types/v2/Base';
import {apiClient} from "@/services/api/client";

export class AuthService {
    static async login(email: string, password: string): Promise<AuthResponse> {
        return apiClient.login(email, password);
    }

    static async logout(): Promise<void> {
        return apiClient.logout();
    }
}

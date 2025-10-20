// src/services/api/services/AuthService.ts
import {AuthResponse} from '@/types/v2/Auth';
import {apiClient} from "@/services/api/client";
import {BaseModel} from "@/types/v2/Base";

export class AuthService {
    static async login(email: string, password: string): Promise<AuthResponse> {
        return apiClient.login(email, password);
    }

    static async emailVerification(email?: string): Promise<void> {
        let data = {
            email: email
        };
        console.info("email verification", data);
        let resp = apiClient.post<BaseModel<any>>("/auth/resend-verification", data);
        console.info("email verification end", data);
        console.info("email verification", resp);
    }

    static async logout(): Promise<void> {
        return apiClient.logout();
    }
}

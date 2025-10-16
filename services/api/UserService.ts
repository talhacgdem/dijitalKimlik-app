// src/services/api/services/UserService.ts
import {UserCreateRequest, UserResponse, UserUpdateRequest} from '@/types/v2/User';
import {BaseModel, Pageable} from '@/types/v2/Base';
import {apiClient} from "@/services/api/client";

export class UserService {
    static async list(params?: {
        per_page?: number;
        page?: number;
    }): Promise<Pageable<any>> {
        return apiClient.get<Pageable<any>>('/users', {params});
    }

    static async get(id: string): Promise<UserResponse> {
        return apiClient.get<UserResponse>(`/users/${id}`);
    }

    static async create(data: UserCreateRequest): Promise<UserResponse> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        return apiClient.postFormData<UserResponse>('/users', formData);
    }

    static async update(id: string, data: UserUpdateRequest): Promise<UserResponse> {
        return apiClient.put<UserResponse>(`/users/${id}`, data);
    }

    static async delete(id: string): Promise<BaseModel<any>> {
        return apiClient.delete<BaseModel<any>>(`/users/${id}`);
    }
}

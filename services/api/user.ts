import {apiClient} from "@/services/api/client";
import {BASE_API_URL} from "@/services/api/Endpoints";
import {NewUserRequest, UpdateUserRequest, UserApiResponse} from "@/types/UserTypes";
import {BaseResponse} from "@/types/baseTypes";

export class UserApiService {

    async getUsers(page: number = 1): Promise<UserApiResponse> {
        return await apiClient.get<UserApiResponse>(`${BASE_API_URL}/users?page=${page}`);
    }

    async createUser(data: Partial<NewUserRequest>): Promise<void> {
        console.log("create user api", data);
        await apiClient.post<BaseResponse>(`${BASE_API_URL}/users`, data);
    }

    async updateUser(identityNumber: string, userData: Partial<UpdateUserRequest>): Promise<void> {
        return await apiClient.patch<void>(`${BASE_API_URL}/users/${identityNumber}`, userData);
    }

    async deleteUser(identityNumber: string): Promise<void> {
        return await apiClient.delete<void>(`${BASE_API_URL}/users/${identityNumber}`);
    }
}

export const usersService = new UserApiService();
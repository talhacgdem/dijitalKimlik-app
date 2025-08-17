import {apiClient} from "@/services/api/client";
import {BASE_API_URL} from "@/services/api/Endpoints";
import {NewUserRequest, UpdateUserRequest, UserApiResponse} from "@/types/UserTypes";
import {BaseResponse} from "@/types/baseTypes";

export class UserApiService {

    async getUsers(page: number = 1): Promise<UserApiResponse> {
        console.log("get users api");
        return await apiClient.get<UserApiResponse>(`${BASE_API_URL}/users?page=${page}`);
    }

    async createUser(data: Partial<NewUserRequest>): Promise<void> {
            console.log("create users api", data);
            let resp = await apiClient.post<BaseResponse>(`${BASE_API_URL}/users`, data);
    }

    async updateUser(identityNumber: string, userData: Partial<UpdateUserRequest>): Promise<void> {
        console.log("update users api", userData);
        return await apiClient.patch<void>(`${BASE_API_URL}/users/${identityNumber}`, userData);
    }

    async deleteUser(identityNumber: string): Promise<void> {
        console.log("delete users api");
        console.log(identityNumber);
        return await apiClient.delete<void>(`${BASE_API_URL}/users/${identityNumber}`);
    }
}

export const usersService = new UserApiService();
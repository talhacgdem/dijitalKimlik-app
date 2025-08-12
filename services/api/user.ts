import {apiClient} from "@/services/api/client";
import {BASE_API_URL} from "@/services/api/Endpoints";

export class UserApiService {

    async getUsers(page: number = 1): Promise<UserApiResponse> {
        return await apiClient.get<UserApiResponse>(`${BASE_API_URL}/users?page=${page}`);
    }


    async createUser(data: Partial<NewUserRequest>): Promise<void> {
        console.log("create users api", data);
        await apiClient.post<void>(`${BASE_API_URL}/users`, data);
    }

    async updateUser(id: number, userData: Partial<UpdateUserRequest>): Promise<void> {
        console.log("update users api", data);
        return await apiClient.patch<void>(`${BASE_API_URL}/users/${id}`, data);
    }

    async deleteUser(id: number): Promise<void> {
        console.log("delete users api");
        return await apiClient.delete<void>(`${BASE_API_URL}/users/${id}`);
    }
}

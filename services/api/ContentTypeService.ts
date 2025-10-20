// src/services/api/services/ContentTypeService.ts
import {ContentTypeResponse} from '@/types/v2/ContentType';
import {BaseModel} from '@/types/v2/Base';
import {apiClient} from "@/services/api/client";

export class ContentTypeService {
    static async list(): Promise<ContentTypeResponse> {
        return apiClient.get<ContentTypeResponse>('/content-types');
    }

    static async get(id: string): Promise<ContentTypeResponse> {
        return apiClient.get<ContentTypeResponse>(`/content-types/${id}`);
    }

    static async create(data: {
        name: string;
        icon: string;
        has_image: boolean;
    }): Promise<ContentTypeResponse> {
        return apiClient.post<ContentTypeResponse>('/content-types', data);
    }

    static async update(id: string, data: {
        name: string;
        icon: string;
        has_image: boolean;
    }): Promise<ContentTypeResponse> {
        return apiClient.post<ContentTypeResponse>(`/content-types/${id}`, data);
    }

    static async delete(id: string): Promise<BaseModel<any>> {
        return apiClient.delete<BaseModel<any>>(`/content-types/${id}`);
    }
}

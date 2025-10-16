// src/services/api/services/ContentService.ts
import {ContentResponse} from '@/types/v2/Content';
import {BaseModel} from '@/types/v2/Base';
import {apiClient} from "@/services/api/client";

export class ContentService {
    static async list(params?: {
        per_page?: number;
        page?: number;
        content_type_id?: string;
    }): Promise<ContentResponse> {
        return apiClient.get<ContentResponse>('/contents', {params});
    }

    static async get(id: string): Promise<BaseModel<any>> {
        return apiClient.get<BaseModel<any>>(`/contents/${id}`);
    }

    static async create(data: {
        content_type_id: string;
        title: string;
        content: string;
        image?: File;
        start_date?: string;
        end_date?: string;
    }): Promise<BaseModel<any>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value);
            }
        });

        return apiClient.postFormData<BaseModel<any>>('/contents', formData);
    }

    static async update(id: string, data: {
        content_type_id?: string;
        title?: string;
        content?: string;
        image?: File;
        start_date?: string;
        end_date?: string;
    }): Promise<BaseModel<any>> {
        const formData = new FormData();
        formData.append('_method', 'PUT');

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value);
            }
        });

        return apiClient.postFormData<BaseModel<any>>(`/contents/${id}`, formData);
    }

    static async delete(id: string): Promise<BaseModel<any>> {
        return apiClient.delete<BaseModel<any>>(`/contents/${id}`);
    }
}

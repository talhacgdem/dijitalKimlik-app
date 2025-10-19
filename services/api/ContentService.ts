// src/services/api/services/ContentService.ts
import {ContentAddRequest, ContentResponse} from '@/types/v2/Content';
import {BaseModel} from '@/types/v2/Base';
import {apiClient} from "@/services/api/client";

export class ContentService {
    static async list(params?: {
        per_page?: number;
        page?: number;
        content_type_id: string;
    }): Promise<ContentResponse> {
        return apiClient.get<ContentResponse>('/contents', {params});
    }

    static async get(id: string): Promise<BaseModel<any>> {
        return apiClient.get<BaseModel<any>>(`/contents/${id}`);
    }

    static async create(data: ContentAddRequest): Promise<BaseModel<any>> {
        const formData = new FormData();
        formData.append('content_type_id', data.content_type_id);
        formData.append('title', data.title);
        formData.append('content', data.content);
        if (data.image) {
            formData.append('image', data.image as any);
        }
        return apiClient.postFormData<BaseModel<any>>('/contents', formData);
    }

    static async update(id: string, data: ContentAddRequest): Promise<BaseModel<any>> {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        if (data.image) {
            formData.append('image', data.image as any);
        }
        return apiClient.postFormData<BaseModel<any>>(`/contents/${id}`, formData);
    }

    static async delete(id: string): Promise<BaseModel<any>> {
        return apiClient.delete<BaseModel<any>>(`/contents/${id}`);
    }
}

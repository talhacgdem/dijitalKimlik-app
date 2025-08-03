import {apiClient} from './client';
import {ContentResponse, NewContentRequest, UpdateContentRequest} from '@/types/ContentTypes';
import {BASE_API_URL} from "@/services/api/Endpoints";

export class ContentApiService {
    private readonly contentType: string;

    constructor(contentType: string) {
        this.contentType = contentType;
    }

    async getContents(page: number = 1): Promise<ContentResponse> {
        return await apiClient.get<ContentResponse>(`${BASE_API_URL}/${this.contentType}?page=${page}`);
    }

    async createContent(data: Partial<NewContentRequest>): Promise<ContentResponse> {
        console.log("create content api", data);
        return await apiClient.post<ContentResponse>(`${BASE_API_URL}/${this.contentType}`, data);
    }

    async updateContent(id: number, data: Partial<UpdateContentRequest>): Promise<ContentResponse> {
        console.log("update content api", data);
        return await apiClient.patch<ContentResponse>(`${BASE_API_URL}/${this.contentType}/${id}`, data);
    }

    async deleteContent(id: number): Promise<ContentResponse> {
        console.log("delete content api");
        return await apiClient.delete<ContentResponse>(`${BASE_API_URL}/${this.contentType}/${id}`);
    }
}

// Factory fonksiyonu (isteğe bağlı)
export const createContentService = (contentType: string) => {
    return new ContentApiService(contentType);
};

// Önceden tanımlanmış servisler (örnek)
export const newsService = new ContentApiService('news');
export const annoucenmentService = new ContentApiService('announcements');
export const campaignService = new ContentApiService('campaigns');
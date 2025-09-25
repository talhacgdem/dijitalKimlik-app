import {apiClient} from './client';
import {BASE_API_URL} from "@/services/api/Endpoints";
import {GenericStorage} from "@/services/storage";
import {DKIconType} from "@/components/dk/Icon";

export class ContentTypeService {
    static async getContentTypes(): Promise<ContentTypeResponse> {
        let contentTypes = await GenericStorage.getItem(GenericStorage.KEY_CONTENT_TYPE) as ContentTypeResponse;
        if (!contentTypes) {
            contentTypes = await this.updateStorage();
        }
        return contentTypes;
    }

    static async createContentType(data: Partial<NewContentTypeRequest>): Promise<ContentResponse> {
        console.log("create content api", data);
        let response = await apiClient.post<ContentResponse>(`${BASE_API_URL}/contentType`, data);
        if (response.success) {
            await this.updateStorage();
        }
        return response;
    }

    static async updateContentType(id: number, data: Partial<NewContentTypeRequest>): Promise<ContentResponse> {
        console.log("update content api", data);
        let response = await apiClient.patch<ContentResponse>(`${BASE_API_URL}/contentType/${id}`, data);
        if (response.success) {
            await this.updateStorage();
        }
        return response;
    }

    static async deleteContentType(id: number): Promise<ContentResponse> {
        console.log("delete content api");
        let response = await apiClient.delete<ContentResponse>(`${BASE_API_URL}/contentType/${id}`);
        if (response.success) {
            await this.updateStorage();
        }
        return response;
    }

    static async updateStorage() {
        console.log("content types api call");
        let contentTypes = await apiClient.get<ContentTypeResponse>(`${BASE_API_URL}/contentType/all`);
        await GenericStorage.setItem(GenericStorage.KEY_CONTENT_TYPE, contentTypes);
        return contentTypes;
    }
}

export class ContentService {

    private readonly contentTypeId: string;
    private readonly contentTypeName: string;

    constructor(contentTypeId: string, contentTypeName: string) {
        this.contentTypeId = contentTypeId;
        this.contentTypeName = contentTypeName;

        console.log("services created with content type id: ", contentTypeId, " and content type name: ", contentTypeName, "")
    }


    async getContents(page: number = 1): Promise<ContentResponse> {
        const url = `${BASE_API_URL}/content?page=${page}?type=${this.contentTypeId}`;
        console.log("content url", url);
        return await apiClient.get<ContentResponse>(`${BASE_API_URL}/content?page=${page}&type=${this.contentTypeId}`);
    }

    async createContent(data: Partial<NewContentRequest>): Promise<ContentResponse> {
        console.log("create content api", data);
        return await apiClient.post<ContentResponse>(`${BASE_API_URL}/content?type=${this.contentTypeId}`, data);
    }

    async updateContent(id: number, data: Partial<UpdateContentRequest>): Promise<ContentResponse> {
        console.log("update content api", data);
        return await apiClient.patch<ContentResponse>(`${BASE_API_URL}/content/${id}?type=${this.contentTypeId}`, data);
    }

    async deleteContent(id: number): Promise<ContentResponse> {
        console.log("delete content api");
        return await apiClient.delete<ContentResponse>(`${BASE_API_URL}/content/${id}?type=${this.contentTypeId}`);
    }
}

// Factory fonksiyonu (isteğe bağlı)
export const createContentService = (contentTypeId: string, contentTypeName: string) => {
    return new ContentService(contentTypeId, contentTypeName);
};

export type ContentItem = {
    id: number;
    title: string;
    content: string;
    image?: string;
    created_at: string;
    [key: string]: any;
}

export type NewContentRequest = {
    title: string;
    content: string;
    image?: string;
    start_date: string,
    end_date: string,
}

export type NewContentTypeRequest = {
    name: string;
    icon: string;
    hasImage: boolean;
}

export type UpdateContentRequest = {
    title: string;
    content: string;
    image?: string;
    start_date: string,
    end_date: string,
}

export type ContentResponse = {
    success: boolean;
    data: ContentItem[];
    meta: {
        current_page: number;
        last_page: number;
    };
    message?: string;
}


export type ContentType = {
    id: number,
    name: string,
    icon: DKIconType,
    hasImage: boolean,
    is_deleted: boolean,
    updated_at: Date,
    created_at: Date
}

export type ContentTypeResponse = {
    success: boolean;
    data: ContentType[];
    meta: {
        current_page: number;
        last_page: number;
    };
    message?: string;
}
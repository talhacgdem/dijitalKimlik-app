import {apiClient} from './client';
import {NewsResponse} from '@/types/ContentTypes';
import {BASE_API_URL} from "@/services/api/Endpoints";

export const getNews = async (page: number = 1): Promise<NewsResponse> => {
    try {
        return await apiClient.get<NewsResponse>(`${BASE_API_URL}/news?page=${page}`);
    } catch (error) {
        console.error('Haberler yüklenirken hata oluştu:', error);
        throw error;
    }
};

export const createNews = async () => {
    console.log("create news api")
};

export const updateNews = async () => {
    console.log("update news api")
};

export const deleteNews = async () => {
    console.log("delete news api")
};

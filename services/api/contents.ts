import {apiClient} from './client';
import {AnnoucementResponse, CampaignResponse, NewsItem, NewsResponse} from '@/types/ContentTypes';
import {BASE_API_URL} from "@/services/api/Endpoints";

//Haberler
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

export const updateNews = async (item: NewsItem, data: Partial<NewsItem>) => {
    console.log("update news api")
    try {
        return await apiClient.get<NewsResponse>(`${BASE_API_URL}/news`);
    } catch (error) {
        console.error('Haberler yüklenirken hata oluştu:', error);
        throw error;
    }
};

export const deleteNews = async () => {
    console.log("delete news api")
};

//Duyurular
export const getAnnoucements = async (page: number = 1): Promise<AnnoucementResponse> => {
    try {
        return await apiClient.get<AnnoucementResponse>(`${BASE_API_URL}/announcements?page=${page}`);
    } catch (error) {
        console.error('Duyurular yüklenirken hata oluştu:', error);
        throw error;
    }
};

//Kampanyalar
export const getCampaigns = async (page: number = 1): Promise<CampaignResponse> => {
    try {
        return await apiClient.get<CampaignResponse>(`${BASE_API_URL}/campaigns?page=${page}`);
    } catch (error) {
        console.error('Kampanyalar yüklenirken hata oluştu:', error);
        throw error;
    }
};
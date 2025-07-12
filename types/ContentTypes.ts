export interface ContentItem {
    id: number;
    title: string;
    content: string;
    image?: string;
    created_at: string;
    [key: string]: any;
}

export interface ContentResponse<T> {
    success: boolean;
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
    };
    message?: string;
}

export type NewsItem = ContentItem
export type NewsResponse = ContentResponse<NewsItem>

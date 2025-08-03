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
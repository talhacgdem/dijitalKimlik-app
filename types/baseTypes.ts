export type BaseResponse = {
    success: boolean;
    data: any;
    meta: {
        current_page: number;
        last_page: number;
    };
    message?: string;
    errors?: {
        [key: string]: string[];
    }
};
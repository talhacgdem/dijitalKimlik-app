import {UserDto} from "@/types/AuthDto";

export interface NewUserRequest {
    identityNumber: string;
    name: string;
    phone: string | undefined | null;
    email: string;
    job: string;
    avatar?: string;
}

export interface UpdateUserRequest {
    name?: string;
    phone?: string;
    email?: string;
    job?: string;
    avatar?: string;
}

export interface UserApiResponse {
    success: boolean;
    data: UserDto[];
    message?: string;
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

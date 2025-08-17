import {UserDto} from "@/types/AuthDto";

export interface NewUserRequest {
    identity_number?: string | null;
    name?: string | null;
    phone?: string | undefined | null;
    email?: string | null;
    job?: string | null;
    image?: string | null;
    password?: string | null;
}

export interface UpdateUserRequest {
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    job?: string | null;
    image?: string | null;
    password?: string | null;
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

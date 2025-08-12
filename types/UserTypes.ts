
export interface NewUserRequest {
    identityNumber: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    profession: string;
    profileImage?: string;
}

export interface UpdateUserRequest {
    identityNumber?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    profession?: string;
    profileImage?: string;
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

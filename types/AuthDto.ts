export interface LoginRequestDTO {
    identityNumber: string;
    password: string;
}

export interface LoginResponseDTO {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: UserDto;
}

export interface UserDto {
    id: number;
    name: string;
    identityNumber: string;
    is_admin: boolean;
    is_deleted: number;
    created_at: Date;
    updated_at: Date;
}
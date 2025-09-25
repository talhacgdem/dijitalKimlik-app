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
    identity_number: string;
    is_deleted: number;
    created_at: Date;
    updated_at: Date;
    image: string;
    job: string;
    birthDate: Date | null;
    email: string;
    user_type: 'admin' | 'user' | 'test';
}
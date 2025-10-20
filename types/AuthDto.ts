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
    id: string,
    identity_number: string;
    email: string,
    name: string,
    phone: string,
    job: string,
    image: string,
    email_verified: boolean,
    email_verified_at: Date,
    password_reset_expires_at: Date,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    user_type: 'admin' | 'user' | 'test';
}
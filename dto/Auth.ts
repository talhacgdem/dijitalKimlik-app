export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    "access_token": string;
    "token_type": string;
    "expires_in": number;
    "user": {
        "id": number,
        "name": string,
        "email": string,
        "is_admin": boolean,
        "is_deleted": number,
        "created_at": Date,
        "updated_at": Date
    }
}
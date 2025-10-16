import {BaseModel} from "@/types/v2/Base";

export interface User {
    id: string,
    identity_number: string;
    email: string,
    name: string,
    phone: string,
    job: string,
    image: string,
    user_type: string,
    email_verified: boolean,
    email_verified_at: Date,
    password_reset_expires_at: Date,
    created_at: string,
    updated_at: string,
    deleted_at: string,
}

export type UserResponse = BaseModel<User>

export interface UserUpdateRequest{
    identity_number?: string;
    email?: string;
    name?: string;
    phone?: string;
    job?: string;
    image?:string;
}

export interface UserCreateRequest{
    email?: string;
    password?: string;
    password_confirmation?: string;
    name?: string;
    phone?: string;
    job?: string;
    image?:string;
}
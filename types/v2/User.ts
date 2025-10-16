import {BaseModel} from "@/types/v2/Base";

interface User {
    id: string,
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
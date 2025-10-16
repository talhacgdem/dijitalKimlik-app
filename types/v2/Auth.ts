import {UserDto} from "@/types/AuthDto";
import {BaseModel} from "@/types/v2/Base";

interface Auth {
    user: UserDto,
    access_token: string,
    token_type: string
    expires_in: number,
    refresh_token: string
}

export type AuthResponse = BaseModel<Auth>
import {BaseModel} from "@/types/v2/Base";

export interface ContentType {
    id: string,
    name: string,
    icon: string,
    has_image: boolean,
    created_at: Date,
    updated_at: Date,
}

export type ContentTypeResponse = BaseModel<ContentType>
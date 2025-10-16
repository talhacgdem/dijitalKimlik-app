import {BaseModel} from "@/types/v2/Base";
import {DKIconType} from "@/components/dk/Icon";

export interface ContentType {
    id: string,
    name: string,
    icon: DKIconType,
    has_image: boolean,
    created_at: Date,
    updated_at: Date,
}

export type ContentTypeResponse = BaseModel<ContentType[]>
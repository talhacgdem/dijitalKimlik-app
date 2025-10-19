import {ContentType} from "@/types/v2/ContentType";
import {Pageable} from "@/types/v2/Base";

export interface Content {
    id: string,
    content_type_id: string,
    content_type: ContentType,
    title: string,
    content: string,
    image: string,
    uploadedImage?: File,
    start_date?: string,
    end_date?: string,
    created_at: string,
    updated_at?: string,
}

export type ContentResponse = Pageable<Content[]>
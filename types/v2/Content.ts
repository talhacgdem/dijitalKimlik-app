import {ContentType} from "@/types/v2/ContentType";
import {Pageable} from "@/types/v2/Base";

interface Content {
    id: string,
    content_type_id: string,
    content_type: ContentType,
    title: string,
    content: string,
    image: string,
    start_date?: Date,
    end_date?: Date,
    created_at?: Date,
    updated_at?: Date,
}

export type ContentResponse = Pageable<Content>
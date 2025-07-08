import {GenericItem} from "@/components/dk/GenericListView";

export type NewsItem = GenericItem
export type AnnouncementItem = GenericItem
export type HotelItem = GenericItem

export interface GenericResponse<T extends GenericItem> {
    success: boolean;
    message: string;
    data: T[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
}

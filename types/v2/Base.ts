export interface BaseModel<T> {
    success: boolean,
    message: string,
    data: T,
    errors?: string[]
}

export interface Pageable<T> extends BaseModel<T> {
    meta?: {
        current_page: number,
        from: number,
        last_page: number,
        per_page: number,
        to: number,
        total: number
    }
}
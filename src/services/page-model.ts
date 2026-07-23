export type PageMeta = {
    page: number;
    size: number;
    total: number;
    totalPages: number;
};

export type PageResponse<T> = {
    data: T[];
    meta: PageMeta;
};
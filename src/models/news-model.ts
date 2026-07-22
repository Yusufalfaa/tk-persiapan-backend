import type { News } from "../generated/prisma/client.js";

export type NewsListResponse = {
    id: number;
    title: string;
    slug: string;
    imagePath: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type NewsDetailResponse = {
    id: number;
    title: string;
    slug: string;
    content: string;
    imagePath: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export function toNewsListResponse(news: News): NewsListResponse {
    return {
        id: news.id,
        title: news.title,
        slug: news.slug,
        imagePath: news.imagePath,
        isPublished: news.isPublished,
        createdAt: news.createdAt,
        updatedAt: news.updatedAt,
    };
}

export function toNewsDetailResponse(news: News): NewsDetailResponse {
    return {
        id: news.id,
        title: news.title,
        slug: news.slug,
        content: news.content,
        imagePath: news.imagePath,
        isPublished: news.isPublished,
        createdAt: news.createdAt,
        updatedAt: news.updatedAt,
    };
}
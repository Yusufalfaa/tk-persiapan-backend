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

export function toNewsListResponse(news: News[]): NewsListResponse[] {
    return news.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        imagePath: item.imagePath,
        isPublished: item.isPublished,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    }));
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

export type NewsRequest = {
    title: string;
    content: string;
    isPublished: boolean;
}

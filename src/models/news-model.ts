import type { News, NewsSection, NewsSectionType } from "../generated/prisma/client.js";

export type NewsListResponse = {
    id: number;
    title: string;
    slug: string;
    thumbnail?: string | null;
    excerpt?: string| null;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type NewsDetailResponse = {
    id: number;
    title: string;
    slug: string;
    isPublished: boolean;
    sections: NewsSectionResponse[];
    createdAt: Date;
    updatedAt: Date;
}

export type NewsSectionResponse = {
    id: number;
    type: NewsSectionType;
    order: number;
    text?: string | null;
    imagePath?: string | null;
    youtubeUrl?: string | null;
}

export function toNewsListResponse(newsList: News[]) : NewsListResponse[] {
    return newsList.map((news) => ({
        id: news.id,
        title: news.title,
        slug: news.slug,
        thumbnail: news.thumbnail,
        excerpt: news.excerpt,
        isPublished: news.isPublished,
        createdAt: news.createdAt,
        updatedAt: news.updatedAt
    }));
}

export function toNewsDetailResponse(news: News & { sections: NewsSection[] }): NewsDetailResponse {
    return {
        id: news.id,
        title: news.title,
        slug: news.slug,
        isPublished: news.isPublished,
        sections: news.sections.map((section) => ({
            id: section.id,
            type: section.type,
            order: section.order,
            text: section.text,
            imagePath: section.imagePath,
            youtubeUrl: section.youtubeUrl,
        })),
        createdAt: news.createdAt,
        updatedAt: news.updatedAt,
    };
}

export type AdminNewsDetailResponse = NewsDetailResponse & {
    sectionCount: number;
    canAddSection: boolean;
}

export type CreateNewsRequest = {
    title: string,
}

export type UpdateNewsRequest = {
    title?: string | undefined,
    isPublished?: boolean | undefined,
}

export type CreateSectionRequest = {
    type: NewsSectionType;
    text?: string | undefined;
    youtubeUrl?: string | undefined;
}

export type UpdateSectionRequest = {
    text?: string | undefined;
    youtubeUrl?: string | undefined;
}

export enum SectionMoveDirection {
    UP = "UP",
    DOWN = "DOWN",
}

export type ReorderSectionRequest = {
    direction: SectionMoveDirection;
}

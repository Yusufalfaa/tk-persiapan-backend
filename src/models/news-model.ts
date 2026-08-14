import type { News, NewsSection, NewsSectionType, Admin } from "../generated/prisma/client.js";
import { StorageService } from "../services/storage-service.js";

export type NewsAuthorResponse = {
    id: number;
    name: string;
} | null;

export type NewsListResponse = {
    id: number;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    excerpt: string | null;
    isPublished: boolean;
    author: NewsAuthorResponse;
    createdAt: Date;
    updatedAt: Date;
}

export type NewsDetailResponse = {
    id: number;
    title: string;
    slug: string;
    isPublished: boolean;
    author: NewsAuthorResponse;
    sections: NewsSectionResponse[];
    createdAt: Date;
    updatedAt: Date;
}

export type NewsSectionResponse = {
    id: number;
    type: NewsSectionType;
    order: number;
    text: string | null;
    imageUrl: string | null;
    youtubeUrl: string | null;
}

function toAuthorResponse(author: Admin | null): NewsAuthorResponse {
    if (!author) return null;
    return {
        id: author.id,
        name: author.name,
    };
}

export function toNewsListResponse(newsList: (News & { author: Admin | null })[]): NewsListResponse[] {
    return newsList.map((news) => ({
        id: news.id,
        title: news.title,
        slug: news.slug,
        thumbnailUrl: news.thumbnail
            ? news.thumbnail
            : null,
        excerpt: news.excerpt,
        isPublished: news.isPublished,
        author: toAuthorResponse(news.author),
        createdAt: news.createdAt,
        updatedAt: news.updatedAt
    }));
}

export function toNewsDetailResponse(
    news: News & { sections: NewsSection[]; author: Admin | null }
): NewsDetailResponse {
    return {
        id: news.id,
        title: news.title,
        slug: news.slug,
        isPublished: news.isPublished,
        author: toAuthorResponse(news.author),
        sections: news.sections.map((section) => ({
            id: section.id,
            type: section.type,
            order: section.order,
            text: section.text,
            imageUrl: section.imagePath
                ? section.imagePath
                : null,
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
    title: string;
}

export type UpdateNewsRequest = {
    title?: string | undefined;
    isPublished?: boolean | undefined;
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
import type { News, NewsSection, NewsSectionImage } from "../generated/prisma/client.js";
import type { NewsSectionType } from "../generated/prisma/enums.js";

export type NewsDetailEntity = News & {
    sections: (NewsSection & {
        images: NewsSectionImage[];
    })[];
};

export type NewsListResponse = {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    excerpt: string | null;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export function toNewsListResponse(newsList: News[]): NewsListResponse[] {
    return newsList.map((news) => ({
        id: news.id,
        title: news.title,
        slug: news.slug,
        thumbnail: news.thumbnail,
        excerpt: news.excerpt,
        isPublished: news.isPublished,
        createdAt: news.createdAt,
        updatedAt: news.updatedAt,
    }));
}

export type NewsDetailResponse = {
    id: number;
    title: string;
    slug: string;
    isPublished: boolean;
    sections: NewsSectionResponse[];
    createdAt: Date;
    updatedAt: Date;
};

export function toNewsDetailResponse(
    news: NewsDetailEntity
): NewsDetailResponse {
    return {
        id: news.id,
        title: news.title,
        slug: news.slug,
        isPublished: news.isPublished,
        sections: news.sections.map(toNewsSectionResponse),
        createdAt: news.createdAt,
        updatedAt: news.updatedAt,
    };
}

export type NewsSectionResponse = {
    id: number;
    type: NewsSectionType;
    order: number;
    text: string | null;
    youtubeUrl: string | null;
    columns: number | null;
    images: NewsSectionImageResponse[];
};

export function toNewsSectionResponse(
    section: NewsDetailEntity["sections"][number]
): NewsSectionResponse {
    return {
        id: section.id,
        type: section.type,
        order: section.order,
        text: section.text,
        youtubeUrl: section.youtubeUrl,
        columns: section.columns,
        images: section.images.map(toNewsSectionImageResponse),
    };
}

export type NewsSectionImageResponse = {
    id: number;
    imagePath: string;
    order: number;
};

export function toNewsSectionImageResponse(
    image: NewsSectionImage
): NewsSectionImageResponse {
    return {
        id: image.id,
        imagePath: image.imagePath,
        order: image.order,
    };
}

export type CreateNewsRequest = {
    title: string,
    isPublished: boolean,
}

export type UpdateNewsRequest = {
    title?: string | undefined,
    isPublished?: boolean | undefined,
}
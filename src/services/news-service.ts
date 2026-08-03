import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import { toNewsDetailResponse, toNewsListResponse, type NewsDetailResponse, type NewsListResponse } from "../models/news-model.js";
import type { PageResponse } from "../models/page-model.js";


export class NewsService {

    private static async generateUniqueSlug(title: string, excludeId?: number): Promise<string> {
        const baseSlug = title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        let slug = baseSlug;
        let counter = 1;

        while (
            await prismaClient.news.findFirst({
                where: {
                    slug,
                    ...(excludeId ? { id: { not: excludeId } } : {}),
                },
            })
        ) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        return slug;
    }

    private static async generateThumbnail(newsId: number) {
        const thumbnail = await prismaClient.newsSection.findFirst({
            where: {
                newsId: newsId,
                type: "IMAGE",
            }, orderBy: {
                order: "asc",
            }, 
        })

        return thumbnail?.imagePath ?? null;
    }

    private static async generateExcerpt(newsId: number) {
        const section = await prismaClient.newsSection.findFirst({
            where: {
                newsId: newsId,
                type: "TEXT",
            }, orderBy: {
                order: "asc",
            },
        })

        if (!section?.text) {
            return null;
        }

        const maxLength = 150;

        return section.text.length > maxLength
        ? section.text.slice(0, maxLength) + "..."
        : section.text;
    }


    static async syncNewsSummary(newsId: number) {
        const [thumbnail, excerpt] = await Promise.all([
            this.generateThumbnail(newsId),
            this.generateExcerpt(newsId),
        ]);

        return prismaClient.news.update({
            where: { id: newsId },
            data: { thumbnail, excerpt },
        });
    }

    static async getList(page: number, size: number) : Promise<PageResponse<NewsListResponse>> {
        const skip = (page - 1) * size;

        const news = await prismaClient.news.findMany({
            where: {
                isPublished: true,
            },
            skip,
            take: size,
        });

        const total = await prismaClient.news.count({
            where: {
                isPublished: true,
            }
        });

        return {
            data: toNewsListResponse(news),
            meta: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size),
            }
        }
    }

    static async getDetail(slug: string) : Promise<NewsDetailResponse> {
        const news = await prismaClient.news.findFirst({
            where: {
                slug: slug,
                isPublished: true,
            },
            include: {
                sections: {
                    orderBy: {
                        order: "asc"
                    }
                }
            }
        });

        if(!news) {
            throw new ResponseError(404, "News not found");
        }

        return toNewsDetailResponse(news)
    }

}
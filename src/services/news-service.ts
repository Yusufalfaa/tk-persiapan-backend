import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import type { News, NewsSection } from "../generated/prisma/client.js";
import { toNewsListResponse, type NewsListResponse } from "../models/news-model.js";
import type { PageResponse } from "../models/page-model.js";


export class NewsService {

    private static async generateThumbnail(newsId: number) {
        const thumbnail = await prismaClient.newsSection.findFirst({
            where: {
                newsId: newsId,
                type: "IMAGE",
            }, orderBy: {
                order: "asc",
            }, include: {
                images: {
                    orderBy: {
                        order: "asc"
                    },
                    take: 1,
                }
            }
        })

        if(!thumbnail) {
            throw new ResponseError(404, "Image not found")
        }

        return thumbnail.images[0]?.imagePath ?? null;
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
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: size,
        })

        const total = await prismaClient.news.count();

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

}
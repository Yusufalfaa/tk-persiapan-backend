import { prismaClient } from "../application/database.js";
import { toNewsListResponse, type NewsListResponse } from "../models/news-model.js";
import type { PageResponse } from "./page-model.js";


export class NewsService {

    static async getList(page: number, size: number): Promise<PageResponse<NewsListResponse>> {
        const skip = (page - 1) * size;

        const news = await prismaClient.news.findMany({
            where: {
                isPublished: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: size,
        });

        const total = await prismaClient.news.count({
            where: {
                isPublished: true,
            },
        });

        return {
            data: toNewsListResponse(news),
            meta: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size),
            },
        };
    }

}
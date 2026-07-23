import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import { toNewsDetailResponse, toNewsListResponse, type NewsDetailResponse, type NewsListResponse } from "../models/news-model.js";
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

    static async get(id: number) : Promise<NewsDetailResponse> {
        const news = await prismaClient.news.findUnique({
            where: {
                id: id,
                isPublished: true,
            }
        });

        if (!news) {
            throw new ResponseError(404, "News not found");
        }

        return toNewsDetailResponse(news);
    }

}
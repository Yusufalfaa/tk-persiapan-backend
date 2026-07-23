import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import { toNewsDetailResponse, toNewsListResponse, type NewsDetailResponse, type NewsListResponse, type NewsRequest } from "../models/news-model.js";
import { NewsValidation } from "../validations/news-validation.js";
import { Validation } from "../validations/validation.js";
import type { PageResponse } from "./page-model.js";


export class NewsService {

    // Public

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
        const news = await prismaClient.news.findFirst({
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

    // Private

    static async getAdminList(page: number, size: number): Promise<PageResponse<NewsListResponse>> {
        const skip = (page - 1) * size;

        const news = await prismaClient.news.findMany({
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: size,
        });

        const total = await prismaClient.news.count();

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

    
    static async getAdmin(id: number) : Promise<NewsDetailResponse> {
        const news = await prismaClient.news.findFirst({
            where: {
                id: id,
            }
        });

        if (!news) {
            throw new ResponseError(404, "News not found");
        }

        return toNewsDetailResponse(news);
    }

    // static async create(request: NewsRequest) : Promise<NewsDetailResponse>{
    //     const createRequest = Validation.validate(NewsValidation.CREATE, request)

    //     const slug = createRequest.title.replace(" ","-")

    //     const news = await prismaClient.news.create({
    //         data: {
    //             createdRequest,
    //         }
    //     })

    // }

}
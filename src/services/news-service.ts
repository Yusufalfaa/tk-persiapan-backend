import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import type { News, NewsSection } from "../generated/prisma/client.js";
import { toNewsDetailResponse, toNewsListResponse, type CreateNewsRequest, type NewsDetailResponse, type NewsListResponse, type UpdateNewsRequest } from "../models/news-model.js";
import type { PageResponse } from "../models/page-model.js";
import { NewsValidation } from "../validations/news-validation.js";
import { Validation } from "../validations/validation.js";


export class NewsService {

    private static async generateUniqueSlug(title: string, excludeId?: number): Promise<string> {
        const baseSlug = title
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
            }, include: {
                images: {
                    orderBy: {
                        order: "asc"
                    },
                    take: 1,
                }
            }
        })

        return thumbnail?.images[0]?.imagePath ?? null;
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

    static async getDetail(slug: string) : Promise<NewsDetailResponse> {
        const news = await prismaClient.news.findFirst({
            where: {
                isPublished: true,
                slug: slug,
            }, include: {
                sections: {
                    orderBy: {
                        order: "asc"
                    },
                    include: {
                        images: {
                            orderBy: {
                                order: "asc"
                            }
                        }
                    }
                }
            }
        })

        if(!news){
            throw new ResponseError(404, "News not found")
        }

        return toNewsDetailResponse(news);
    }

    static async getAdminList(page: number, size: number) : Promise<PageResponse<NewsListResponse>> {
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

    static async getAdminDetail(slug: string) : Promise<NewsDetailResponse> {
        const news = await prismaClient.news.findFirst({
            where: {
                slug: slug,
            }, include: {
                sections: {
                    orderBy: {
                        order: "asc"
                    },
                    include: {
                        images: {
                            orderBy: {
                                order: "asc"
                            }
                        }
                    }
                }
            }
        })

        if(!news){
            throw new ResponseError(404, "News not found")
        }

        return toNewsDetailResponse(news);
    }

    static async createNews(request: CreateNewsRequest) : Promise<NewsDetailResponse> {
        const createRequest = Validation.validate<CreateNewsRequest>(NewsValidation.CREATE, request);

        const slug = await this.generateUniqueSlug(createRequest.title);

        const response = await prismaClient.news.create({
            data: {
                title: createRequest.title,
                slug: slug,
                isPublished: createRequest.isPublished ?? false,
            },
            include: {
                sections: {
                    orderBy: { order: "asc" },
                    include: {
                        images: {
                            orderBy: { order: "asc" }
                        }
                    }
                }
            }
        })

        return toNewsDetailResponse(response)
    }

    static async updateNews(request: UpdateNewsRequest, id: number): Promise<NewsDetailResponse> {
        const updateRequest = Validation.validate<UpdateNewsRequest>(NewsValidation.UPDATE, request);

        const existingNews = await prismaClient.news.findUnique({
            where: { id },
        });

        if (!existingNews) {
            throw new ResponseError(404, "News not found");
        }

        const slug = updateRequest.title
            ? await this.generateUniqueSlug(updateRequest.title, id)
            : undefined;

        const response = await prismaClient.news.update({
            where: { id },
            data: {
                ...(updateRequest.title !== undefined && { title: updateRequest.title }),
                ...(slug !== undefined && { slug }),
                ...(updateRequest.isPublished !== undefined && { isPublished: updateRequest.isPublished }),
            },
            include: {
                sections: {
                    orderBy: { order: "asc" },
                    include: {
                        images: { orderBy: { order: "asc" } },
                    },
                },
            },
        });

        return toNewsDetailResponse(response);
    }


}
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import type { Prisma } from "../generated/prisma/client.js";
import { NewsSectionType } from "../generated/prisma/enums.js";
import { SectionMoveDirection, toNewsDetailResponse, toNewsListResponse, type AdminNewsDetailResponse, type CreateNewsRequest, type CreateSectionRequest, type NewsDetailResponse, type NewsListResponse, type ReorderSectionRequest, type UpdateNewsRequest, type UpdateSectionRequest } from "../models/news-model.js";
import type { PageResponse } from "../models/page-model.js";
import { NewsValidation } from "../validations/news-validation.js";
import { Validation } from "../validations/validation.js";
import { StorageService } from "./storage-service.js";

import sanitizeHtml from "sanitize-html";

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

        const plainText = sanitizeHtml(section.text, {
            allowedTags: [],
            allowedAttributes: {},
        });

        const maxLength = 150;

        return plainText.length > maxLength
        ? plainText.slice(0, maxLength) + "..."
        : plainText;
    }

    private static async reorderSections(newsId: number) {
        const sections = await prismaClient.newsSection.findMany({
            where: {
                newsId
            },
            orderBy: {
                order: "asc"
            }
        });

        await prismaClient.$transaction(
            sections.map((section, index) =>
                prismaClient.newsSection.update({
                    where: {
                        id: section.id
                    },
                    data: {
                        order: index
                    }
                })
            )
        );
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

    static async getList(page: number, size: number): Promise<PageResponse<NewsListResponse>> {
        const skip = (page - 1) * size;

        const news = await prismaClient.news.findMany({
            where: {
                isPublished: true,
            },
            include: {
                author: true,
            },
            skip,
            take: size,
        });

        const total = await prismaClient.news.count({
            where: { isPublished: true },
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

    static async getDetail(slug: string): Promise<NewsDetailResponse> {
        const news = await prismaClient.news.findFirst({
            where: {
                slug: slug,
                isPublished: true,
            },
            include: {
                sections: {
                    orderBy: { order: "asc" },
                },
                author: true,
            },
        });

        if (!news) {
            throw new ResponseError(404, "News not found");
        }

        return toNewsDetailResponse(news);
    }

    static async getAdminList(page: number, size: number): Promise<PageResponse<NewsListResponse>> {
        const skip = (page - 1) * size;

        const news = await prismaClient.news.findMany({
            skip,
            take: size,
            orderBy: { createdAt: "desc" },
            include: {
                author: true,
            },
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

    static async getAdminDetail(newsId: number): Promise<AdminNewsDetailResponse> {
        const news = await prismaClient.news.findFirst({
            where: { id: newsId },
            include: {
                sections: {
                    orderBy: { order: "asc" },
                },
                author: true,
            },
        });

        if (!news) {
            throw new ResponseError(404, "News not found");
        }

        const response = toNewsDetailResponse(news);

        return {
            ...response,
            sectionCount: news.sections.length,
            canAddSection: news.sections.length < 10,
        };
    }

    static async createNews(request: CreateNewsRequest, authorId: number): Promise<NewsDetailResponse> {
        const createRequest = Validation.validate<CreateNewsRequest>(NewsValidation.CREATE, request);

        const generatedSlug = await this.generateUniqueSlug(createRequest.title);

        const news = await prismaClient.news.create({
            data: {
                title: createRequest.title,
                slug: generatedSlug,
                isPublished: false,
                authorId,
            },
            include: {
                sections: true,
                author: true,
            },
        });

        return toNewsDetailResponse(news);
    }

    static async updateNews(request: UpdateNewsRequest, newsId: number): Promise<NewsDetailResponse> {
        const updateRequest = Validation.validate<UpdateNewsRequest>(NewsValidation.UPDATE, request);

        const existingNews = await prismaClient.news.findUnique({
            where: { id: newsId },
        });

        if (!existingNews) {
            throw new ResponseError(404, "News not found");
        }

        let slug = existingNews.slug;

        if (updateRequest.title) {
            slug = await this.generateUniqueSlug(updateRequest.title, newsId);
        }

        const news = await prismaClient.news.update({
            where: { id: newsId },
            data: {
                ...(updateRequest.title && {
                    title: updateRequest.title,
                    slug,
                }),
                ...(updateRequest.isPublished !== undefined && {
                    isPublished: updateRequest.isPublished,
                }),
            },
            include: {
                sections: true,
                author: true,
            },
        });

        return toNewsDetailResponse(news);
    }
    
    static async deleteNews(newsId: number): Promise<void> {
        const news = await prismaClient.news.findUnique({
            where: { id: newsId },
            include: { sections: true },
        });

        if (!news) {
            throw new ResponseError(404, "News not found");
        }

        const imagePaths = news.sections
            .filter(section => section.type === NewsSectionType.IMAGE)
            .map(section => section.imagePath)
            .filter((path): path is string => path !== null);

        await StorageService.deleteMany(imagePaths);

        await prismaClient.news.delete({
            where: { id: newsId },
        });
    }

    static async createSection(request: CreateSectionRequest, newsId: number, file?: Express.Multer.File): Promise<AdminNewsDetailResponse> {
        const createRequest : CreateSectionRequest = Validation.validate(NewsValidation.CREATE_SECTION, request);

        let news = await prismaClient.news.findUnique({
            where: {
                id: newsId
            },
            include: {
                sections: true,
            }
        })

        if (!news) {
            throw new ResponseError(404, "News not found");
        }

        if (news.sections.length >= 10) {
            throw new ResponseError(400, "Maximum 10 sections");
        }

        if (createRequest.type === NewsSectionType.IMAGE && !file) {
            throw new ResponseError(400, "Image is required");
        }

        const order = news.sections.length;

        let data: Prisma.NewsSectionUncheckedCreateInput;

        switch (createRequest.type) {
            case NewsSectionType.TEXT:
                data = {
                    type: NewsSectionType.TEXT,
                    text: sanitizeHtml(createRequest.text!, {
                        allowedTags: ["b", "p", "strong", "i", "em", "u", "ul", "ol", "li", "a"],
                        allowedAttributes: {
                            a: ["href", "target", "rel"],
                        },
                        allowedSchemes: ["http", "https"],
                        transformTags: {
                            a: sanitizeHtml.simpleTransform("a", {
                                target: "_blank",
                                rel: "noopener noreferrer",
                            }),
                        },
                    }),
                    order,
                    newsId,
                };
                break;

            case NewsSectionType.YOUTUBE:
                data = {
                    type: NewsSectionType.YOUTUBE,
                    youtubeUrl: createRequest.youtubeUrl!,
                    order,
                    newsId,
                };
                break;

            case NewsSectionType.IMAGE:
                data = {
                    type: NewsSectionType.IMAGE,
                    imagePath: StorageService.getStoragePath(
                        "news",
                        file!.filename
                    ),
                    order,
                    newsId,
                };
                break;
        }

        await prismaClient.newsSection.create({
            data,
        });

        await this.syncNewsSummary(newsId);

        return await this.getAdminDetail(newsId);
    }

    static async updateSection(request: UpdateSectionRequest, sectionId: number, file?: Express.Multer.File): Promise<AdminNewsDetailResponse> {
        const updateRequest : UpdateSectionRequest = Validation.validate(NewsValidation.UPDATE_SECTION, request);

        let section = await prismaClient.newsSection.findUnique({
            where: {
                id: sectionId
            },
        })

        if (!section) {
            throw new ResponseError(404, "Section not found");
        }

        if (section.type === NewsSectionType.IMAGE && !file) {
            throw new ResponseError(400, "Image is required");
        }

        let data: Prisma.NewsSectionUpdateInput = {};

        const oldImagePath = section.imagePath;

        switch (section.type) {
            case NewsSectionType.TEXT:
                if (!updateRequest.text) {
                    throw new ResponseError(400, "Text is required for TEXT section");
                }

                data = {
                    text: sanitizeHtml(updateRequest.text, {
                        allowedTags: ["b", "p", "strong", "i", "em", "u", "ul", "ol", "li", "a"],
                        allowedAttributes: {
                            a: ["href", "target", "rel"],
                        },
                        allowedSchemes: ["http", "https"],
                        transformTags: {
                            a: sanitizeHtml.simpleTransform("a", {
                                target: "_blank",
                                rel: "noopener noreferrer",
                            }),
                        },
                    }),
                    youtubeUrl: null,
                    imagePath: null,
                };

                break;


            case NewsSectionType.YOUTUBE:

                if (!updateRequest.youtubeUrl) {
                    throw new ResponseError(400, "Youtube URL is required for YOUTUBE section");
                }

                data = {
                    youtubeUrl: updateRequest.youtubeUrl,
                    text: null,
                    imagePath: null,
                };

                break;


            case NewsSectionType.IMAGE:

                if(!file) {
                    throw new ResponseError(400, "Image file is required for IMAGE section");
                }

                data = {
                    youtubeUrl: null,
                    text: null,
                    imagePath: StorageService.getStoragePath(
                        "news",
                        file.filename
                    ),
                };

                break;
        }

        await prismaClient.newsSection.update({
            where: {
                id: sectionId
            },
            data,
        });

        if (section.type === NewsSectionType.IMAGE && oldImagePath) {
            await StorageService.delete(oldImagePath);
        }

        await this.syncNewsSummary(section.newsId);

        return await this.getAdminDetail(section.newsId);
    }

    static async deleteSection(sectiondId: number) {
        const section = await prismaClient.newsSection.findUnique({
            where: {
                id: sectiondId,
            }
        })

        if(!section) {
            throw new ResponseError(404, "Section not found")
        }

        await prismaClient.newsSection.delete({
            where: {
                id: sectiondId,
            }
        })

        if(section.type === NewsSectionType.IMAGE && section.imagePath) {
            await StorageService.delete(section.imagePath)
        }

        await this.reorderSections(section.newsId);
        await this.syncNewsSummary(section.newsId);
    }

    static async moveSection(request: ReorderSectionRequest, sectionId: number) {
        const moveRequest = Validation.validate(NewsValidation.MOVE_SECTION, request);

        const section = await prismaClient.newsSection.findUnique({
            where: {
                id: sectionId
            }
        });

        if (!section) {
            throw new ResponseError(404, "Section not found");
        }

        let targetSection;
        if (moveRequest.direction === SectionMoveDirection.UP) {
            targetSection = await prismaClient.newsSection.findFirst({
                where: {
                    newsId: section.newsId,
                    order: section.order - 1
                }
            });
        } else {
            targetSection = await prismaClient.newsSection.findFirst({
                where: {
                    newsId: section.newsId,
                    order: section.order + 1
                }
            });
        }

        if (!targetSection) {
            return await this.getAdminDetail(section.newsId);
        }

        await prismaClient.$transaction([

            prismaClient.newsSection.update({
                where: {
                    id: section.id
                },
                data: {
                    order: -1
                }
            }),

            prismaClient.newsSection.update({
                where: {
                    id: targetSection.id
                },
                data: {
                    order: section.order
                }
            }),

            prismaClient.newsSection.update({
                where: {
                    id: section.id
                },
                data: {
                    order: targetSection.order
                }
            }),

        ]);

        await this.syncNewsSummary(section.newsId);

        return await this.getAdminDetail(section.newsId);
    }

}
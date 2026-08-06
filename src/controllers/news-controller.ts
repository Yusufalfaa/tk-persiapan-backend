import type { Request, Response, NextFunction } from "express";
import { NewsService } from "../services/news-service.js";
import { ResponseError } from "../errors/response-error.js";
import type { CreateNewsRequest, CreateSectionRequest, ReorderSectionRequest, UpdateNewsRequest, UpdateSectionRequest } from "../models/news-model.js";
import type { AuthRequest } from "../type/auth-request.js";
import { StorageService } from "../services/storage-service.js";


export class NewsController {

    static async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) ?? 1;
            const size = Number(req.query.size) ?? 10;

            const response = await NewsService.getList(page, size);
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    static async getDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const slug = req.params.slug;

            if (typeof slug !== "string") {
                throw new ResponseError(400, "Invalid slug");
            }

            if(!slug) {
                throw new ResponseError(404, "News not found")
            }

            const response = await NewsService.getDetail(slug);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async getAdminList(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) ?? 1;
            const size = Number(req.query.size) ?? 10;

            const response = await NewsService.getAdminList(page, size);
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    static async getAdminDetail(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if(!id) {
                throw new ResponseError(404, "News not found")
            }

            const response = await NewsService.getAdminDetail(id);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async createNews(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const request : CreateNewsRequest = {
                title: req.body.title
            };

            const response = await NewsService.createNews(request);

            res.status(201).json({
                data: response,
            })

        } catch (e) {
            next(e);
        }
    }

    static async updateNews(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const newsId = Number(req.params.id)
            const request : UpdateNewsRequest = {
                title: req.body.title,
                isPublished: req.body.isPublished
            }

            const response = await NewsService.updateNews(request, newsId)

            res.status(200).json({
                data: response,
            })

        } catch (e) {
            next(e);
        }
    }

    static async deleteNews(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const newsId = Number(req.params.id)
            
            await NewsService.deleteNews(newsId)

            res.status(200).json({
                message: "News deleted successfully"
            })
        } catch (e) {
            next(e);
        }
    }

    static async createSection(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const newsId = Number(req.params.newsId);
            const request : CreateSectionRequest = {
                type: req.body.type,
                text: req.body.text,
                youtubeUrl: req.body.youtubeUrl,
            }

            const response = await NewsService.createSection(request, newsId, req.file)

            res.status(201).json({
                data: response,
            });
        } catch (e) {
            if (req.file) {
                await StorageService.delete(
                    StorageService.getStoragePath(
                        "news",
                        req.file.filename
                    )
                );
            }

            next(e);
        }
    }

    static async updateSection(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const newsId = Number(req.params.sectionId);
            const request : UpdateSectionRequest = {
                text: req.body.text,
                youtubeUrl: req.body.youtubeUrl,
            }

            const response = await NewsService.updateSection(request, newsId, req.file)

            res.status(200).json({
                data: response,
            });
        } catch (e) {
            if (req.file) {
                await StorageService.delete(
                    StorageService.getStoragePath(
                        "news",
                        req.file.filename
                    )
                );
            }

            next(e);
        }
    }

    static async deleteSection(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const sectionId = Number(req.params.sectionId)

            await NewsService.deleteSection(sectionId)

            res.status(200).json({
                message: "Section deleted successfully"
            })

        } catch (e) {
            next(e);
        }
    }

    static async moveSection(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const sectionId = Number(req.params.sectionId)
            const request : ReorderSectionRequest = {
                direction: req.body.direction
            }
            const response = await NewsService.moveSection(request, sectionId)

            res.status(200).json({
                data: response,
            })

        } catch(e) {
            next(e);
        }
    }
}
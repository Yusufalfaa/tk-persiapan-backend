import type { Request, Response, NextFunction } from "express";
import { NewsService } from "../services/news-service.js";
import { ResponseError } from "../errors/response-error.js";
import type { CreateNewsRequest, UpdateNewsRequest } from "../models/news-model.js";


export class NewsController {

    static async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) | 1;
            const size = Number(req.query.size) | 10;

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

    static async getAdminList(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) | 1;
            const size = Number(req.query.size) | 10;

            const response = await NewsService.getAdminList(page, size);
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    static async getAdminDetail(req: Request, res: Response, next: NextFunction) {
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

    static async createNews(req: Request, res: Response, next: NextFunction) {
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

    static async updateNews(req: Request, res: Response, next: NextFunction) {
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

    static async deleteNews(req: Request, res: Response, next: NextFunction) {
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

}
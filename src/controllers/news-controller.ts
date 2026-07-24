import type { Request, Response, NextFunction } from "express";
import { NewsService } from "../services/news-service.js";
import { ResponseError } from "../errors/response-error.js";
import type { AuthRequest } from "../type/auth-request.js";


export class NewsController {

    static async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 1;
            const size = Number(req.query.size) || 9;
            const response = await NewsService.getList(page, size)

            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    static async getDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const slug = req.params.slug;

            if (!slug || Array.isArray(slug)) {
                throw new ResponseError(400, "Invalid news slug");
            }

            const response = await NewsService.getDetail(slug);

            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async getAdminList(req: AuthRequest, res: Response, next: NextFunction) {
        console.log("GET ADMIN NEWS");
        try {
            const page = Number(req.query.page) || 1;
            const size = Number(req.query.size) || 9;
            const response = await NewsService.getAdminList(page, size)

            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    
    static async getAdminDetail(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const slug = req.params.slug;

            if (!slug || Array.isArray(slug)) {
                throw new ResponseError(400, "Invalid news slug");
            }

            const response = await NewsService.getAdminDetail(slug);

            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async createNews(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const response = await NewsService.createNews(req.body);

            res.status(201).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateNews(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const response = await NewsService.updateNews(req.body, Number(req.params.id));

            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

}
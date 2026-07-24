import type { Request, Response, NextFunction } from "express";
import { NewsService } from "../services/news-service.js";
import { ResponseError } from "../errors/response-error.js";


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

}
import type { Request, Response, NextFunction } from "express";
import { NewsService } from "../services/news-service.js";


export class NewsController {

    static async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page);
            const size = Number(req.query.size);

            const response = NewsService.getList(page, size);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e)
        }
    }

}
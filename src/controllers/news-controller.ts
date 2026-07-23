import type { Request, Response, NextFunction } from "express";
import { NewsService } from "../services/news-service.js";


export class NewsController {

    static async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page ?? 1);
            const size = Number(req.query.size ?? 10);
            const response = await NewsService.getList(page, size)

            res.status(200).json(response);

        } catch (e) {
            next(e);
        }
    }

}
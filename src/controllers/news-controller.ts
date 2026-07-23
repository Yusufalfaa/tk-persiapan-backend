import type { Request, Response, NextFunction } from "express";
import { NewsService } from "../services/news-service.js";
import type { AuthRequest } from "../type/auth-request.js";


export class NewsController {

    // Public

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

    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const response = await NewsService.get(id);

            res.status(200).json({
                data: response
            });

        } catch (e) {
            next(e);
        }
    }

    // Private

    static async getAdminList(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page ?? 1);
            const size = Number(req.query.size ?? 10);
            const response = await NewsService.getList(page, size)

            res.status(200).json(response);

        } catch (e) {
            next(e);
        }
    }

    static async getAdmin(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const response = await NewsService.get(id);

            res.status(200).json({
                data: response
            });

        } catch (e) {
            next(e);
        }
    }

}
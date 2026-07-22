import type { Request, Response, NextFunction } from "express";
import { SchoolService } from "../services/school-service.js";
import { logger } from "../application/logging.js";
import type { SchoolProfileUpdateRequest } from "../models/school-model.js";


export class SchoolController {

    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await SchoolService.get();
            logger.debug(`response: ${JSON.stringify(response)}`);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const request : SchoolProfileUpdateRequest = req.body as SchoolProfileUpdateRequest;
            const response = await SchoolService.update(request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

}
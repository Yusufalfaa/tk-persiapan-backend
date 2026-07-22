import type { Request, Response, NextFunction } from "express";
import { TeacherService } from "../services/teacher-service.js";


export class TeacherController {

    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await TeacherService.get();
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

}
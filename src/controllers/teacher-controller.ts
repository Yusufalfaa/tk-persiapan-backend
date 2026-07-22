import type { Request, Response, NextFunction } from "express";
import { TeacherService } from "../services/teacher-service.js";
import type { TeacherRequest } from "../models/teacher-model.js";


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

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request : TeacherRequest = req.body as TeacherRequest;

            const response = await TeacherService.create(request)

            res.status(201).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

}
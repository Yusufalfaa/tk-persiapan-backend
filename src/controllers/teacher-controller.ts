import type { Request, Response, NextFunction } from "express";
import { TeacherService } from "../services/teacher-service.js";
import type { TeacherRequest } from "../models/teacher-model.js";
import type { AuthRequest } from "../type/auth-request.js";


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

    static async create(req: AuthRequest, res: Response, next: NextFunction) {
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

    static async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const request: TeacherRequest = req.body as TeacherRequest;
            const teacherId = Number(req.params.id);

            const response = await TeacherService.update(request, teacherId)

            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async delete(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const teacherId = Number(req.params.id);
            const response = await TeacherService.delete(teacherId)

            res.status(200).json({
                data: response,
            })
        } catch (e) {
            next(e);
        };
    };
};
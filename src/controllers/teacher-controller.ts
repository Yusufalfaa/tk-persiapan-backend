import type { Request, Response, NextFunction } from "express";
import { TeacherService } from "../services/teacher-service.js";
import type { TeacherRequest, TeacherUpdateRequest } from "../models/teacher-model.js";
import type { AuthRequest } from "../type/auth-request.js";


export class TeacherController {

    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            const response = await TeacherService.get(id);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page ?? 1);
            const size = Number(req.query.size ?? 10);
            const response = await TeacherService.getList(page, size);
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    static async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const request : TeacherRequest = {
                name: req.body.name,
                position: req.body.position,
                order: Number(req.body.order),
            }

            const response = await TeacherService.create(request, req.file)

            res.status(201).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const request: TeacherUpdateRequest = {
                ...(req.body.name !== undefined && {
                    name: req.body.name
                }),

                ...(req.body.position !== undefined &&  {
                    position: req.body.position
                }),

                ...(req.body.order !== undefined && {
                    order: Number(req.body.order)
                }),
            };


            const response = await TeacherService.update(request, Number(req.params.id), req.file);

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
            await TeacherService.delete(teacherId)

            res.status(200).json({
                message: "Teacher deleted successfully"
            })
        } catch (e) {
            next(e);
        };
    };
};
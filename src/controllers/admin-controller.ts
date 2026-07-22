import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../type/auth-request.js";
import { AdminService } from "../services/admin-service.js";
import type { AdminRequest } from "../models/admin-model.js";


export class AdminController {

    static async get(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const response = await AdminService.get();
            res.status(200).json({
                data: response,
            })
        } catch (e) {
            next(e);
        }
    }

    static async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const request : AdminRequest = req.body as AdminRequest;

            const response = await AdminService.create(request);

            res.status(201).json({
                data: response,
            })
        
        } catch (e) {
            next(e)
        }
    }

    static async resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const adminId = Number(req.params.id);

            await AdminService.resetPassword(req.body, adminId);

            res.status(200).json({
                message: "Password reset successfully"
            });
        } catch (e) {
            next(e);
        }
    }

    static async delete(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const adminId = Number(req.params.id);
            const response = await AdminService.delete(adminId);

            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

}
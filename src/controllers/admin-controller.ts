import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../type/auth-request.js";
import { AdminService } from "../services/admin-service.js";
import type { AdminRequest } from "../models/admin-models.js";


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

}
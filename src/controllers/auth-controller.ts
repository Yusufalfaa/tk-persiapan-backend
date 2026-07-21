import type { Request, Response, NextFunction } from "express";
import type { LoginRequest } from "../models/auth-model.js";
import { AuthService } from "../services/auth-service.js";
import type { AuthRequest } from "../type/auth-request.js";

export class AuthController {

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginRequest = req.body as LoginRequest;
            const response = await AuthService.login(request);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }

    static async get(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const response = await AuthService.get(req.admin!);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }
    
}
import type { Request, Response, NextFunction } from "express";
import type { LoginRequest } from "../models/auth-model.js";
import { AuthService } from "../services/auth-service.js";

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
    
}
import type { Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboard-service.js";
import type { AuthRequest } from "../type/auth-request.js";


export class DashboardController {
    static async getStats(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const response = await DashboardService.getStats();
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }
}
import jwt from "jsonwebtoken";
import type { Response, NextFunction } from "express";

import { prismaClient } from "../application/database.js";
import type { AuthRequest } from "../type/auth-request.js";

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authorization = req.get("Authorization");

        if (!authorization) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        if (!authorization.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        const token = authorization.substring(7);

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {
            id: number;
            role: string;
        };

        const admin = await prismaClient.admin.findUnique({
            where: {
                id: payload.id,
            },
        });

        if (!admin) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        req.admin = admin;

        next();
    } catch {
        res.status(401).json({
            message: "Unauthorized",
        });
    }
};
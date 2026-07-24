import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import multer from "multer";
import { ResponseError } from "../errors/response-error.js";
import { Prisma } from "../generated/prisma/client.js";

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {

    if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of error.issues) {
            const field = issue.path.join(".") || "unknown";
            if (!fieldErrors[field]) {
                fieldErrors[field] = issue.message;
            }
        }

        res.status(400).json({
            message: "Validation error",
            errors: fieldErrors,
        });
        return;
    }

    if (error instanceof ResponseError) {
        res.status(error.status).json({
            message: error.message,
        });
        return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const target = error.meta?.target;
        const field = Array.isArray(target) ? target[0] : "Field";

        res.status(409).json({
            message: `${field} already exists`,
        });
        return;
    }

    if (error instanceof multer.MulterError) {

        if(error.code === "LIMIT_FILE_SIZE"){
            res.status(400).json({
                message:"File size exceeds 2MB"
            });
            return;
        }

        if(error.code === "LIMIT_FILE_COUNT"){
            res.status(400).json({
                message:"Maximum 10 files allowed"
            });
            return;
        }

        res.status(400).json({
            message:error.message
        });

        return;
    }


    if(error.message?.includes("Only image files are allowed")){
        res.status(400).json({
            message:error.message
        });
        return;
    }


    console.error(error);

    res.status(500).json({
        message:"Internal server error"
    });
};
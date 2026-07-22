import type { Request, Response,  NextFunction } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../errors/response-error.js";
import { Prisma } from "../generated/prisma/client.js";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if(error instanceof ZodError) {
        res.status(400).json({
            errors: `Validation Error : ${JSON.stringify(error)}`
        });
    } else if (error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message
        })
    } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"){
        return res.status(409).json({
            errors: "Username already exists"
        });
    } else {
        res.status(500).json({
            errors: error.message
        })
    }
}
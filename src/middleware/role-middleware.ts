import type { Response, NextFunction } from "express"
import type { AdminRole } from "../generated/prisma/enums.js"
import type { AuthRequest } from "../type/auth-request.js"
import { ResponseError } from "../errors/response-error.js"

export const requireRole = (...roles : AdminRole[]) => {

    return (req: AuthRequest, res: Response, next: NextFunction) => {

        if(!req.admin) {
            throw new ResponseError(401, "Unauthorized");
        }

        if(!roles.includes(req.admin.role)) {
            throw new ResponseError(403, "Forbidden")
        }

        next();

    }

}
import type { Request } from "express";
import type { Admin } from "../generated/prisma/client.js"

export interface AuthRequest extends Request {
    admin?: Admin
}
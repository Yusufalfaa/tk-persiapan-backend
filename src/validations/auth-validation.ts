import { z, ZodType } from "zod";
import type { LoginRequest, UpdateCurrentRequest } from "../models/auth-model.js";

export class AuthValidation {

    static readonly LOGIN : ZodType<LoginRequest> = z.object({
        username: z.string().min(3).max(50),
        password: z.string().min(6).max(255),
    })

    static readonly UPDATE : ZodType<UpdateCurrentRequest> = z.object({
        name: z.string().min(3).max(100).optional(),
        password: z.string().min(6).max(255).optional(),
    })


}
import { z, ZodType } from "zod";
import type { LoginRequest } from "../models/auth-model.js";

export class AuthValidation {

    static readonly LOGIN : ZodType<LoginRequest> = z.object({
        username: z.string().min(3).max(20),
        password: z.string().min(6).max(20),
    })


}
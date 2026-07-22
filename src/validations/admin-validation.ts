import { z, ZodType } from "zod";
import type { AdminRequest, ResetPasswordRequest } from "../models/admin-model.js";

export class AdminValidation {

    static readonly CREATE : ZodType<AdminRequest> = z.object ({
        username: z.string().min(3).max(50),
        password: z.string().min(6).max(255),
        name: z.string().min(3).max(100),
    })

    static readonly PATCH : ZodType<ResetPasswordRequest> = z.object ({
        newPassword: z.string().min(6).max(255),
    })

}
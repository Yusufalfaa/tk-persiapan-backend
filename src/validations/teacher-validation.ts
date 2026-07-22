import { z, ZodType } from "zod";
import type { TeacherRequest } from "../models/teacher-model.js";

export class TeacherValidation {

    static readonly CREATE: ZodType<TeacherRequest> = z.object({
        name: z.string().trim().min(3).max(100),
        position: z.string().trim().min(3).max(100),
        photoPath: z.url().nullable(),
        order: z.number().int().min(0),
    })

}
import { z, ZodType } from "zod";
import type { TeacherCreateRequest, TeacherUpdateRequest } from "../models/teacher-model.js";

export class TeacherValidation {

    static readonly CREATE: ZodType<TeacherCreateRequest> = z.object({
        name: z.string().trim().min(3).max(100),
        position: z.string().trim().min(3).max(100),
        order: z.number().int().min(0),
    })

    static readonly UPDATE: ZodType<TeacherUpdateRequest> = z.object({
        name: z.string().trim().min(3).max(100).optional(),
        position: z.string().trim().min(3).max(100).optional(),
        order: z.number().int().min(0).optional(),
    })

}
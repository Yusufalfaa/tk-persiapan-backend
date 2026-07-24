import { z, ZodType } from "zod";
import type { CreateNewsRequest, UpdateNewsRequest } from "../models/news-model.js";

export class NewsValidation {

    static readonly CREATE : ZodType<CreateNewsRequest> = z.object({
        title: z.string().min(5).max(100),
        isPublished: z.boolean(),
    })

    static readonly UPDATE : ZodType<UpdateNewsRequest> = z.object({
        title: z.string().min(5).max(100).optional(),
        isPublished: z.boolean().optional(),
    })


}
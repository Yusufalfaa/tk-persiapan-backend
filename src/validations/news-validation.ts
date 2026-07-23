import { z, ZodType } from "zod";
import type { NewsRequest } from "../models/news-model.js";

export class NewsValidation {

    static readonly CREATE : ZodType<NewsRequest> = z.object ({
        title: z.string().min(5).max(100),
        content: z.string().min(10),
        isPublished: z.boolean(),
    })

}
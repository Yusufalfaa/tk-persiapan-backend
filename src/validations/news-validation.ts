import { z, ZodType } from "zod";
import type { CreateNewsRequest, CreateSectionRequest, UpdateNewsRequest } from "../models/news-model.js";

export class NewsValidation {

    static readonly CREATE : ZodType<CreateNewsRequest> = z.object({
        title: z.string().min(5).max(100),
        isPublished: z.boolean(),
    })

    static readonly UPDATE : ZodType<UpdateNewsRequest> = z.object({
        title: z.string().min(5).max(100).optional(),
        isPublished: z.boolean().optional(),
    })

    static readonly CREATE_SECTION: ZodType<CreateSectionRequest> =
        z.discriminatedUnion("type", [
            z.object({
                type: z.literal("TEXT"),
                order: z.number().min(0),
                text: z.string().min(1),
            }),

            z.object({
                type: z.literal("IMAGE"),
                order: z.number().min(0),
                columns: z.number().min(1).max(4),
            }),

            z.object({
                type: z.literal("YOUTUBE"),
                order: z.number().min(0),
                youtubeUrl: z.string(),
            }),
        ]);

}
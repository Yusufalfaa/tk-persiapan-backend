import { z, ZodType } from "zod";
import type { CreateNewsRequest, CreateSectionRequest, UpdateNewsRequest, UpdateSectionRequest } from "../models/news-model.js";
import { NewsSectionType } from "../generated/prisma/enums.js";

const youtubeUrlSchema = z
    .url()
    .refine(
        (url) =>
            url.includes("youtube.com") ||
            url.includes("youtu.be"),
        {
            message: "Only YouTube URL is allowed"
        }
    );

export class NewsValidation {

    static readonly CREATE : ZodType<CreateNewsRequest> = z.object({
        title: z.string().min(5).max(255)
    })

    static readonly UPDATE : ZodType<UpdateNewsRequest> = z.object({
        title: z.string().min(5).max(255).optional(),
        isPublished: z.boolean().optional()
    })

    static readonly CREATE_SECTION: ZodType<CreateSectionRequest> = z.object({
        type: z.enum(NewsSectionType),
        text: z.string().min(10).optional(),
        youtubeUrl: z.url().optional(),
    })
    .superRefine((data, ctx) => {

        if (data.type === NewsSectionType.TEXT && !data.text) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["text"],
                message: "Text is required for TEXT section",
            });
        }


        if (data.type === NewsSectionType.YOUTUBE && !data.youtubeUrl) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["youtubeUrl"],
                message: "Youtube URL is required for YOUTUBE section",
            });
        }

    });
    
    static readonly UPDATE_SECTION: ZodType<UpdateSectionRequest> = z.object({
        text: z.string().min(10).optional(),
        youtubeUrl: youtubeUrlSchema.optional(),
    });
}
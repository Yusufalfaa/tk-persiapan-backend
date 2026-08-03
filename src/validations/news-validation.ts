import { z, ZodType } from "zod";
import type { CreateNewsRequest, CreateSectionRequest, UpdateNewsRequest } from "../models/news-model.js";
import { NewsSectionType } from "../generated/prisma/enums.js";

export class NewsValidation {

    static readonly CREATE : ZodType<CreateNewsRequest> = z.object({
        title: z.string().min(5).max(255)
    })

    static readonly UPDATE : ZodType<UpdateNewsRequest> = z.object({
        title: z.string().min(5).max(255).optional(),
        isPublished: z.boolean().optional()
    })

    static readonly CREATE_SECTION: ZodType<CreateSectionRequest> = z
        .object({
            type: z.nativeEnum(NewsSectionType),
            text: z.string().min(10).optional(),
            youtubeUrl: z.string().url().optional(),
        })
        .superRefine((data, ctx) => {

            if (data.type === NewsSectionType.TEXT) {

                if (!data.text) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["text"],
                        message: "Text is required for TEXT section",
                    });
                }

                if (data.youtubeUrl) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["youtubeUrl"],
                        message: "Youtube URL is not allowed for TEXT section",
                    });
                }
            }


            if (data.type === NewsSectionType.YOUTUBE) {

                if (!data.youtubeUrl) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["youtubeUrl"],
                        message: "Youtube URL is required for YOUTUBE section",
                    });
                }

                if (data.text) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["text"],
                        message: "Text is not allowed for YOUTUBE section",
                    });
                }
            }

        });
}
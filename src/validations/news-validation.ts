import { z, ZodType } from "zod";
import type { CreateNewsRequest, CreateSectionRequest, UpdateImageSectionRequest, UpdateNewsRequest, UpdateTextSectionRequest, UpdateYoutubeSectionRequest } from "../models/news-model.js";

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
                order: z.coerce.number().int().min(0).optional(),
                text: z.string().min(1),
            }),

            z.object({
                type: z.literal("IMAGE"),
                order: z.coerce.number().int().min(0).optional(),
                columns: z.coerce.number().int().min(1).max(4),
            }),

            z.object({
                type: z.literal("YOUTUBE"),
                order: z.coerce.number().int().min(0).optional(),
                youtubeUrl: z.url(),
            }),
        ]);

    static readonly UPDATE_TEXT_SECTION: ZodType<UpdateTextSectionRequest> = z.object({
        order: z.number().min(0).optional(),
        text: z.string().min(1).optional(),
    });

    static readonly UPDATE_IMAGE_SECTION: ZodType<UpdateImageSectionRequest> = z.object({
        order: z.number().min(0).optional(),
        columns: z.number().int().min(1).max(4).optional(),
    });

    static readonly UPDATE_YOUTUBE_SECTION: ZodType<UpdateYoutubeSectionRequest> = z.object({
        order: z.number().min(0).optional(),
        youtubeUrl: z.url().optional(),
    });

}
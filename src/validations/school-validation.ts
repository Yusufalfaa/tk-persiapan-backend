import { z, ZodType } from "zod";
import type { SchoolProfileUpdateRequest } from "../models/school-model.js";

export class SchoolValidation {

    static readonly UPDATE: ZodType<SchoolProfileUpdateRequest> = z.object({
        name: z.string().min(3).max(100).optional(),
        vision: z.string().min(10).optional(),
        address: z.string().min(5).max(500).optional(),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        googleMapsUrl: z.url().optional(),
        phone: z.string().min(10).max(20).optional(),
        email: z.email().optional(),
        instagramUrl:z.url().nullable(),
        videoUrl: z.url().nullable().optional(),
        missions: z.array(z.object(
            {content: z.string().min(5).max(500)}
        )).optional()
    });
}
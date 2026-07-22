import { z, ZodType } from "zod";
import type { SchoolProfileUpdateRequest } from "../models/school-model.js";

export class SchoolValidation {

    static readonly UPDATE: ZodType<SchoolProfileUpdateRequest> = z.object({
        name: z.string().min(3).max(100),
        vision: z.string().min(10),
        address: z.string().min(5).max(500),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        googleMapsUrl: z.url(),
        phone: z.string().min(10).max(20),
        email: z.email(),
        videoUrl: z.url().nullable(),
        missions: z.array(z.object(
            {content: z.string().min(5).max(500),order: z.number().int().min(0)}
        )).min(1)
    });
}
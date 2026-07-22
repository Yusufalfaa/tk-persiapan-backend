import type { Teacher } from "../generated/prisma/client.js";

export type TeacherResponse = {
    id: number,
    name: string,
    position: string,
    photoPath: string | null,
    order: number,
    createdAt: Date,
    updatedAt: Date,
}

export function toTeacherResponse(teacher: Teacher) : TeacherResponse {
    return {
        id: teacher.id,
        name: teacher.name,
        position: teacher.position,
        photoPath: teacher.photoPath,
        order: teacher.order,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
    };
}
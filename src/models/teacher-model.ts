import type { Teacher } from "../generated/prisma/client.js";

export type TeacherListResponse = {
    id: number;
    name: string;
    position: string;
    photoPath: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
};

export type TeacherResponse = {
    id: number;
    name: string;
    position: string;
    photoPath: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
};

export type TeacherRequest = {
    name: string;
    position: string;
    order: number;
};

export type TeacherUpdateRequest = {
    name?: string | undefined;
    position?: string | undefined;
    order?: number | undefined;
};

export function toTeacherListResponse(teachers: Teacher[]): TeacherListResponse[] {
    return teachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        position: teacher.position,
        photoPath: teacher.photoPath,
        order: teacher.order,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
    }));
}

export function toTeacherResponse(teacher: Teacher): TeacherResponse {
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
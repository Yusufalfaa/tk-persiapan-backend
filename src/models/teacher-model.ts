import type { Teacher } from "../generated/prisma/client.js";
import { StorageService } from "../services/storage-service.js";

export type TeacherListResponse = {
    id: number;
    name: string;
    position: string;
    photoUrl: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
};

export type TeacherResponse = {
    id: number;
    name: string;
    position: string;
    photoUrl: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
};

export type TeacherCreateRequest = {
    name: string;
    position: string;
    order?: number | undefined;
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
        photoUrl: teacher.photoPath
            ? StorageService.getPublicUrlFromPath(
                teacher.photoPath
            )
            : null,
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
        photoUrl: teacher.photoPath
            ? StorageService.getPublicUrlFromPath(
                teacher.photoPath
            )
            : null,

        order: teacher.order,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
    };
}
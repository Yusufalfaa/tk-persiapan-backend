import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import { toTeacherListResponse, toTeacherResponse, type TeacherListResponse, type TeacherRequest, type TeacherResponse, type TeacherUpdateRequest } from "../models/teacher-model.js";
import { TeacherValidation } from "../validations/teacher-validation.js";
import { Validation } from "../validations/validation.js";
import type { PageResponse } from "../models/page-model.js";
import { StorageService } from "./storage-service.js";


export class TeacherService {

    static async get(id: number): Promise<TeacherResponse> {
        const teacher = await prismaClient.teacher.findUnique({
            where: {
                id,
            },
        });

        if (!teacher) {
            throw new ResponseError(404, "Teacher not found");
        }

        return toTeacherResponse(teacher);
    }

    static async getList(page: number, size: number) : Promise<PageResponse<TeacherListResponse>> {
        const skip = (page - 1) * size;
        
        const teachers = await prismaClient.teacher.findMany({
            orderBy: {
                order: "asc",
            },
            skip,
            take: size,
        });

        const total = await prismaClient.teacher.count();

        return {
            data: toTeacherListResponse(teachers),
            meta: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size),
            }
        }
    }

    static async create(request: TeacherRequest, file?: Express.Multer.File): Promise<TeacherResponse> {
        const createRequest = Validation.validate(TeacherValidation.CREATE, request);

        let photoPath: string | null = null;

        if(file){
            photoPath = StorageService.getPublicPath(
                "teacher",
                file.filename
            );
        }

        const teacher = await prismaClient.teacher.create({
            data: {
                ...createRequest,
                photoPath
            }
        });

        return toTeacherResponse(teacher)
    }

    static async update(request: TeacherUpdateRequest, teacherId: number, file?: Express.Multer.File): Promise<TeacherResponse> {
        const teacher = await prismaClient.teacher.findUnique({
            where: {
                id: teacherId
            }
        })
        
        if (!teacher) {
            throw new ResponseError(404, "Teacher not found");
        }

        const updateRequest = Validation.validate(TeacherValidation.UPDATE, request);

        let photoPath = teacher.photoPath;

        if (file) {

            if (teacher.photoPath) {
                await StorageService.delete(teacher.photoPath);
            }

            photoPath = StorageService.getPublicPath("teacher",file.filename);
        }

        const updatedTeacher = await prismaClient.teacher.update({
            where: {
                id: teacherId
            },
            data: {
                ...(updateRequest.name !== undefined && {
                    name: updateRequest.name
                }),

                ...(updateRequest.position !== undefined && {
                    position: updateRequest.position
                }),

                ...(updateRequest.order !== undefined && {
                    order: updateRequest.order
                }),

                photoPath
            }
        });

        return toTeacherResponse(updatedTeacher)
    }

    static async delete(teacherId: number) {
        const teacher = await prismaClient.teacher.findUnique({
            where: {
                id: teacherId
            }
        });

        if (!teacher) {
            throw new ResponseError(404, "Teacher not found");
        }

        if(teacher.photoPath){
            await StorageService.delete(
                teacher.photoPath
            );
        }

        await prismaClient.teacher.delete({
            where: {
                id: teacherId
            }
        })
    }

}
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import { toTeacherListResponse, toTeacherResponse, type TeacherListResponse, type TeacherRequest, type TeacherResponse } from "../models/teacher-model.js";
import { TeacherValidation } from "../validations/teacher-validation.js";
import { Validation } from "../validations/validation.js";
import type { PageResponse } from "./page-model.js";


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

    static async create(request: TeacherRequest): Promise<TeacherResponse> {
        const createRequest = Validation.validate(TeacherValidation.CREATE, request);

        const teacher = await prismaClient.teacher.create({
            data: createRequest
        });

        return toTeacherResponse(teacher)
    }

    static async update(request: TeacherRequest, teacherId: number): Promise<TeacherResponse> {
        const updateRequest = Validation.validate(TeacherValidation.UPDATE, request);

        const teacher = await prismaClient.teacher.findUnique({
            where: {
                id: teacherId
            }
        });

        if (!teacher) {
            throw new ResponseError(404, "Teacher not found");
        }

        const updatedTeacher = await prismaClient.teacher.update({
            where: {
                id: teacherId
            },
            data: updateRequest
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

        await prismaClient.teacher.delete({
            where: {
                id: teacherId
            }
        })
    }

}
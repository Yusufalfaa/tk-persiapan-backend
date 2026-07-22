import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import { toTeacherResponse, type TeacherRequest, type TeacherResponse } from "../models/teacher-model.js";
import { TeacherValidation } from "../validations/teacher-validation.js";
import { Validation } from "../validations/validation.js";


export class TeacherService {

    static async get() : Promise<TeacherResponse[]> {
        const teachers = await prismaClient.teacher.findMany({
            orderBy: {
                order: "asc",
            },
        });

        return teachers.map(toTeacherResponse);
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
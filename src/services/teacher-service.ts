import { prismaClient } from "../application/database.js";
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

}
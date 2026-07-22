import { prismaClient } from "../application/database.js";
import { toTeacherResponse, type TeacherResponse } from "../models/teacher-model.js";


export class TeacherService {

    static async get() : Promise<TeacherResponse[]> {
        const teachers = await prismaClient.teacher.findMany({
            orderBy: {
                order: "asc",
            },
        });

        return teachers.map(toTeacherResponse);
    }

}
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import { toSchoolProfileResponse, type SchoolProfileResponse } from "../models/school-model.js";

export class SchoolService {

    static async get(): Promise<SchoolProfileResponse> {
        const school = await prismaClient.schoolProfile.findUnique({
            where: {
                id: 1
            },
            include: {
                missions: {
                    orderBy: {
                        order: "asc"
                    }
                }
            }
        });

        if(!school){
            throw new ResponseError(404, "School not found");
        }

        return toSchoolProfileResponse(school);
    }
    
}
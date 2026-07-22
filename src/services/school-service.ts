import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import { toSchoolProfileResponse, type SchoolProfileResponse, type SchoolProfileUpdateRequest } from "../models/school-model.js";
import { SchoolValidation } from "../validations/school-validation.js";
import { Validation } from "../validations/validation.js";

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

    static async update(request: SchoolProfileUpdateRequest): Promise<SchoolProfileResponse> {

        const updateRequest = Validation.validate(SchoolValidation.UPDATE,request);

        await prismaClient.$transaction(async (tx) => {

            await tx.schoolProfile.update({
                where: {
                    id: 1,
                },
                data: {
                    name: updateRequest.name,
                    vision: updateRequest.vision,
                    address: updateRequest.address,
                    latitude: updateRequest.latitude,
                    longitude: updateRequest.longitude,
                    googleMapsUrl: updateRequest.googleMapsUrl,
                    phone: updateRequest.phone,
                    email: updateRequest.email,
                    videoUrl: updateRequest.videoUrl,
                }
            });

            await tx.mission.deleteMany({
                where: {
                    schoolId: 1,
                }
            });

            await tx.mission.createMany({
                data: updateRequest.missions.map((mission) => ({
                    content: mission.content,
                    order: mission.order,
                    schoolId: 1,
                }))
            });

        });

        const school = await prismaClient.schoolProfile.findUnique({
            where: {
                id: 1,
            },
            include: {
                missions: {
                    orderBy: {
                        order: "asc",
                    }
                }
            }
        });


        if (!school) {
            throw new ResponseError(404,"School not found");
        }

        return toSchoolProfileResponse(school);
    }
    
}
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

        const updateRequest = Validation.validate<SchoolProfileUpdateRequest>(SchoolValidation.UPDATE,request);

        await prismaClient.$transaction(async (tx) => {

            await tx.schoolProfile.update({
                where: {
                    id: 1,
                },
                data: {
                    ...(updateRequest.name !== undefined && { name: updateRequest.name }),
                    ...(updateRequest.vision !== undefined && { vision: updateRequest.vision }),
                    ...(updateRequest.address !== undefined && { address: updateRequest.address }),
                    ...(updateRequest.latitude !== undefined && { latitude: updateRequest.latitude }),
                    ...(updateRequest.longitude !== undefined && { longitude: updateRequest.longitude }),
                    ...(updateRequest.googleMapsUrl !== undefined && { googleMapsUrl: updateRequest.googleMapsUrl }),
                    ...(updateRequest.phone !== undefined && { phone: updateRequest.phone }),
                    ...(updateRequest.email !== undefined && { email: updateRequest.email }),
                    ...(updateRequest.videoUrl !== undefined && { videoUrl: updateRequest.videoUrl }),
                }
            });

            if (updateRequest.missions !== undefined) {
                await tx.mission.deleteMany({
                    where: { schoolId: 1 },
                });

                await tx.mission.createMany({
                    data: updateRequest.missions.map((mission, index) => ({
                        content: mission.content,
                        order: index,
                        schoolId: 1,
                    }))
                });
            }

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
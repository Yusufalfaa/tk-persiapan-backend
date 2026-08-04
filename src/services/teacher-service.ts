import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import { toTeacherListResponse, toTeacherResponse, type TeacherListResponse, type TeacherCreateRequest, type TeacherResponse, type TeacherUpdateRequest } from "../models/teacher-model.js";
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

    static async create(request: TeacherCreateRequest, file?: Express.Multer.File): Promise<TeacherResponse> {
        const createRequest = Validation.validate(TeacherValidation.CREATE, request);

        const teacher = await prismaClient.$transaction(async (tx) => {
            const order = createRequest.order ?? await tx.teacher.count()+1;

            await tx.teacher.updateMany({
                where:{
                    order:{
                        gte: order
                    }
                },
                data:{
                    order:{
                        increment:1
                    }
                }
            });

            let photoPath: string | null = null;

            if(file){
                photoPath = StorageService.getPublicPath(
                    "teachers",
                    file.filename
                );
            }

            return tx.teacher.create({
                data:{
                    name:createRequest.name,
                    position:createRequest.position,
                    order,
                    photoPath
                }
            });

        });
        return toTeacherResponse(teacher)
    }

    static async update(request: TeacherUpdateRequest, teacherId: number, file?: Express.Multer.File): Promise<TeacherResponse> {
        const updateRequest = Validation.validate(TeacherValidation.UPDATE, request);

        const teacher = await prismaClient.teacher.findUnique({
            where: {
                id: teacherId
            }
        })
        
        if (!teacher) {
            throw new ResponseError(404, "Teacher not found");
        }

        let photoPath = teacher.photoPath;

        if (file) {
            photoPath = StorageService.getPublicPath(
                "teachers",
                file.filename
            );
        }

        const totalTeacher = await prismaClient.teacher.count();

        if (
            updateRequest.order !== undefined &&
            (updateRequest.order < 1 || updateRequest.order > totalTeacher)
        ) {
            throw new ResponseError(400, "Invalid order");
        }

        const updatedTeacher = await prismaClient.$transaction(async (tx) => {

            if (
                updateRequest.order !== undefined &&
                updateRequest.order !== teacher.order
            ) {

                await tx.teacher.update({
                    where:{
                        id: teacherId
                    },
                    data:{
                        order:-1
                    }
                });

                if(updateRequest.order < teacher.order){
                    const teachers = await tx.teacher.findMany({
                        where: {
                            order: {
                                gte: updateRequest.order,
                                lt: teacher.order
                            }
                        },
                        orderBy: {
                            order: "desc"
                        }
                    });

                    for (const t of teachers) {
                        await tx.teacher.update({
                            where: {
                                id: t.id
                            },
                            data: {
                                order: t.order + 1
                            }
                        });
                    }
                } else {
                    const teachers = await tx.teacher.findMany({
                        where: {
                            order: {
                                gt: teacher.order,
                                lte: updateRequest.order
                            }
                        },
                        orderBy: {
                            order: "asc"
                        }
                    });

                    for (const t of teachers) {
                        await tx.teacher.update({
                            where: {
                                id: t.id
                            },
                            data: {
                                order: t.order - 1
                            }
                        });
                    }
                }
            }


            return tx.teacher.update({
                where:{
                    id:teacherId
                },
                data:{
                    ...(updateRequest.name !== undefined && {
                        name:updateRequest.name
                    }),

                    ...(updateRequest.position !== undefined && {
                        position:updateRequest.position
                    }),

                    ...(updateRequest.order !== undefined && {
                        order:updateRequest.order
                    }),

                    photoPath
                }
            });

        });
        if (file && teacher.photoPath) {
            await StorageService.delete(teacher.photoPath)
            };

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

        await prismaClient.$transaction(async (tx) => {
                await tx.teacher.delete({
                    where: {
                        id: teacherId
                    }
                });

                const teachers = await tx.teacher.findMany({
                    where: {
                        order: {
                            gt: teacher.order
                        }
                    },
                    orderBy: {
                        order: "asc"
                    }
                });

                for (const t of teachers) {

                    await tx.teacher.update({
                        where: {
                            id: t.id
                        },
                        data: {
                            order: t.order - 1
                        }
                    });
                }
            });

        if(teacher.photoPath){
            await StorageService.delete(
                teacher.photoPath
            );
        }
    }

}
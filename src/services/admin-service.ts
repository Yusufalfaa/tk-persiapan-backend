import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import { AdminRole } from "../generated/prisma/enums.js";
import { toAdminListResponse, toAdminResponse, type AdminListResponse, type AdminRequest, type AdminResponse, type ResetPasswordRequest } from "../models/admin-model.js";
import { AdminValidation } from "../validations/admin-validation.js";
import { Validation } from "../validations/validation.js";
import bcrypt from "bcrypt";
import type { PageResponse } from "./page-model.js";

export class AdminService {

    static async get(id: number): Promise<AdminResponse> {
        const admin = await prismaClient.admin.findUnique({
            where: {
                id: id,
            },
        })

        if (!admin) {
            throw new ResponseError(404, "Admin not found")
        }

        return toAdminResponse(admin);
    }

    static async getList(page: number, size: number): Promise<PageResponse<AdminListResponse>> {
        const skip = (page - 1) * size;
        
        const admins = await prismaClient.admin.findMany({
            orderBy: {
                id: "asc",
            },
            skip,
            take: size,
        })
        
        const total = await prismaClient.admin.count();

        return {
            data: toAdminListResponse(admins),
            meta: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size),
            }
        }   
    }

    static async create(request: AdminRequest) : Promise<AdminResponse> {
        const createRequest = Validation.validate(AdminValidation.CREATE, request);

        const passwordHash = await bcrypt.hash(createRequest.password, 10);

        const admin = await prismaClient.admin.create({
            data: {
                username: createRequest.username,
                passwordHash,
                name: createRequest.name,
                role: AdminRole.ADMIN,
            }
        });

        return toAdminResponse(admin);

    }

    static async resetPassword(request: ResetPasswordRequest, adminId: number) {
        const resetRequest = Validation.validate(AdminValidation.PATCH, request);

        const admin = await prismaClient.admin.findUnique({
            where: {
                id: adminId
            }
        });

        if(!admin) {
            throw new ResponseError(404, "Admin not found");
        }

        const isSamePassowrd = await bcrypt.compare(resetRequest.newPassword, admin.passwordHash);
        
        if(isSamePassowrd) {
            throw new ResponseError(400, "New password cannot be same as old password")
        };

        const passwordHash = await bcrypt.hash(resetRequest.newPassword, 10);

        await prismaClient.admin.update({
            where: {
                id: adminId,
            },
            data: {
                passwordHash
            }
        });
    }

    static async delete(adminId: number) {
        const admin = await prismaClient.admin.findUnique({
            where: {
                id: adminId
            }
        });

        if (!admin) {
            throw new ResponseError(404, "Admin not found");
        }

        if (admin.role === "SUPER_ADMIN") {
            throw new ResponseError(400, "Cannot delete SUPER ADMIN")
        }

        await prismaClient.admin.delete({
            where: {
                id: adminId
            }
        })
    }

}
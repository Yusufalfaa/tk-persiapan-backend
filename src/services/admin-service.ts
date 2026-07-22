import { prismaClient } from "../application/database.js";
import { AdminRole } from "../generated/prisma/enums.js";
import { toAdminResponse, type AdminRequest, type AdminResponse } from "../models/admin-models.js";
import { AdminValidation } from "../validations/admin-validation.js";
import { Validation } from "../validations/validation.js";
import bcrypt from "bcrypt";

export class AdminService {

    static async get(): Promise<AdminResponse[]> {
        const admins = await prismaClient.admin.findMany()

        return admins.map(toAdminResponse);
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

}
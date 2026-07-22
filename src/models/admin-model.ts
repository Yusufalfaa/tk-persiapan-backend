import type { Admin } from "../generated/prisma/client.js";
import type { AdminRole } from "../generated/prisma/enums.js"

export type AdminRequest = {
    username: string,
    password: string,
    name: string,
}

export type AdminResponse = {
    id: number;
    username: string;
    name: string;
    role: AdminRole;
    createdAt: Date;
    updatedAt: Date;
}

export function toAdminResponse(admin: Admin): AdminResponse {
    return {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
    };
}

export type ResetPasswordRequest = {
    newPassword: string;
}
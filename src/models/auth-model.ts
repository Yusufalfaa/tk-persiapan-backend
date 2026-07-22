import type { Admin, AdminRole } from "../generated/prisma/client.js";

export type LoginRequest = {
    username: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
}

export type CurrentUserResponse = {
    id: number;
    username: string;
    name: string;
    role: AdminRole;
    createdAt: Date;
    updatedAt: Date;
}

export function toCurrentUserResponse(admin: Admin): CurrentUserResponse {
    return {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
    };
}

export type UpdateCurrentRequest = {
    name?: string | undefined ;
    oldPassword?: string | undefined;
    newPassword?: string | undefined;
};
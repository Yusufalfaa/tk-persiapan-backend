import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import type { Admin } from "../generated/prisma/client.js";
import { toCurrentUserResponse, type CurrentUserResponse, type LoginRequest, type LoginResponse, type UpdateCurrentRequest } from "../models/auth-model.js";
import { AuthValidation } from "../validations/auth-validation.js";
import { Validation } from "../validations/validation.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {

    static async login(request: LoginRequest): Promise<LoginResponse> {
        const loginRequest = Validation.validate<LoginRequest>(AuthValidation.LOGIN, request);

        let admin = await prismaClient.admin.findUnique({
            where: {
                username: loginRequest.username
            }
        });

        if(!admin) {
            throw new ResponseError(401, "Invalid username or password");
        }

        const isPassowrdValid = await bcrypt.compare(loginRequest.password, admin.passwordHash);
        if (!isPassowrdValid) {
            throw new ResponseError(401, "Invalid username or password");
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const accessToken = jwt.sign(
            {
            id: admin.id,
            role: admin.role,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "30m"}
        );

        return {
            accessToken,
        };

    }

    static async get(admin: Admin): Promise<CurrentUserResponse> {
        return toCurrentUserResponse(admin);
    }

    static async update(admin: Admin, request: UpdateCurrentRequest): Promise<CurrentUserResponse> {
        const updateRequest = Validation.validate(AuthValidation.UPDATE, request);

        const data: {
            name?: string;
            passwordHash?: string;
        } = {};

        if(updateRequest.name) {
            data.name = updateRequest.name;
        }

        if(updateRequest.newPassword) {

            if(!updateRequest.oldPassword) {
                throw new ResponseError(400, "Old password is required");
            }

            const isPassowrdValid = await bcrypt.compare(updateRequest.oldPassword, admin.passwordHash);

            if(!isPassowrdValid) {
                throw new ResponseError(400, "Old password is incorrect");
            }

            data.passwordHash = await bcrypt.hash(updateRequest.newPassword, 10);
        }

        if(Object.keys(data).length === 0) {
            throw new ResponseError(400, "No changes provided");
        }

        const result = await prismaClient.admin.update({
            where: {
                id: admin.id,
            },
            data,
        });

        return toCurrentUserResponse(result);
    }

    static async logout(admin: Admin): Promise<void> {

    }

}
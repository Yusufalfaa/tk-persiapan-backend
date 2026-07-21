import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import type { LoginRequest, LoginResponse } from "../models/auth-model.js";
import { AuthValidation } from "../validations/auth-validation.js";
import { Validation } from "../validations/validation.js";
import bcrypt from "bcrypt";
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

}
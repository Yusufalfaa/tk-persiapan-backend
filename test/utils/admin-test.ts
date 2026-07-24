import bcrypt from "bcrypt";
import supertest from "supertest";
import { web } from "../../src/application/web.js";
import { prismaClient } from "../../src/application/database.js";
import type { Admin } from "../../src/generated/prisma/client.js";

export class AdminTest {

    static async deleteAll() {
        await prismaClient.admin.deleteMany();
    }

    static async createSuperAdmin() {
        await prismaClient.admin.create({
            data: {
                id: 1,
                username: "superadmin",
                passwordHash: await bcrypt.hash("superadmin123", 10),
                name: "Super Admin",
                role: "SUPER_ADMIN"
            }
        })
    }

    static async get(): Promise<Admin> {
        const admin = await prismaClient.admin.findFirst({
            where: {
                id: 2,
            }
        })

        if(!admin) {
            throw new Error("User is not found");
        }

        return admin;

    }

    static async getAccessToken(): Promise<string> {
        const response = await supertest(web)
            .post("/api/auth/login")
            .send({
                username: "superadmin",
                password: "superadmin123"
            });

        expect(response.status).toBe(200);

        return response.body.data.accessToken;
    }

}
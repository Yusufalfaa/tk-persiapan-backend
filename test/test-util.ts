import bcrypt from "bcrypt";
import supertest from "supertest";
import { web } from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";

export class AuthTest {
    
    static async create(){
        await prismaClient.admin.create({
            data: {
                username: "Admin",
                name: "Admin satu",
                passwordHash: await bcrypt.hash("Admin123", 10)
            }
        })
    }

    static async delete() {
        await prismaClient.admin.delete({
            where: {
                username: "Admin"
            }
        })
    }

    static async getAccessToken(): Promise<string> {
        const response = await supertest(web)
            .post("/api/auth/login")
            .send({
                username: "Admin",
                password: "Admin123"
            });

        expect(response.status).toBe(200);

        return response.body.data.accessToken;
    }

}
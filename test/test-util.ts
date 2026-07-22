import bcrypt from "bcrypt";
import supertest from "supertest";
import { web } from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";
import type { Admin, SchoolProfile, Mission } from "../src/generated/prisma/client.js";

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

    static async get(): Promise<Admin> {
        const admin = await prismaClient.admin.findFirst({
            where: {
                username: "Admin"
            }
        })

        if(!admin) {
            throw new Error("User is not found");
        }

        return admin;

    }

}

export class SchoolTest {
    
    static async delete() {
        await prismaClient.schoolProfile.delete({
            where: {
                id: 1,
            }
        })
    }

    static async create() {
        await prismaClient.schoolProfile.create({
            data: {
                id: 1,
                name: "TK Persiapan",
                vision: "Menjadi sekolah terbaik",
                address: "Jl. Pendidikan No. 1",
                latitude: -6.235336,
                longitude: 106.882385,
                googleMapsUrl: "https://maps.google.com",
                phone: "08123456789",
                email: "tk@persiapan.com",
                videoUrl: "https://youtube.com",
                missions: {
                    create: [
                        {
                            content: "Mendidik anak dengan baik",
                            order: 1
                        },
                        {
                            content: "Mengembangkan kreativitas anak",
                            order: 2
                        }
                    ]
                }
            }
        });
    }

    static async get(): Promise<
        SchoolProfile & {
            missions: Mission[];
        }
    > {
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
            throw new Error("School is not found");
        }

        return school;
    }
}
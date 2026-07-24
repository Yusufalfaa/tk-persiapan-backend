import { prismaClient } from "../../src/application/database.js";
import type { SchoolProfile, Mission } from "../../src/generated/prisma/client.js";

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

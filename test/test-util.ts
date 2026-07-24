import bcrypt from "bcrypt";
import supertest from "supertest";
import { web } from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";
import type { Admin, SchoolProfile, Mission } from "../src/generated/prisma/client.js";
import { NewsService } from "../src/services/news-service.js";

export class AuthTest {
    
    static async create(){
        await prismaClient.admin.create({
            data: {
                id: 2,
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

export class TeacherTest {
    static async deleteAll() {
        await prismaClient.teacher.deleteMany()
    }

    static async create() {
        await prismaClient.teacher.createMany({
            data: [
                {   
                    id: 1,
                    name: "Ibu Sri Wahyuni",
                    position: "Kepala Sekolah",
                    photoPath: "/uploads/teachers/dewi-lestari.jpg",
                    order: 1
                },
                {
                    id: 2,
                    name: "Ibu Dewi Lestari",
                    position: "Guru Kelas A",
                    photoPath: null,
                    order: 2
                },
            ]
        })
    }
}

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

export class NewsTest {
    static async deleteAll() {
        await prismaClient.news.deleteMany();
    }

    static async create() {
        await prismaClient.news.createMany({
            data: [
                {
                    id: 1,
                    title: "Lomba TK 2026",
                    slug: "lomba-tk-2026",
                    isPublished: true,
                },
                {
                    id: 2,
                    title: "Penerimaan Peserta Didik Baru",
                    slug: "ppdb-2026",
                    isPublished: true,
                },
                {
                    id: 3,
                    title: "Kegiatan Outing Class",
                    slug: "outing-class-2026",
                    isPublished: false,
                },
            ],
        });
    }

    static async createWithSections() {
        const news = await prismaClient.news.create({
            data: {
                title: "Lomba TK 2026",
                slug: "lomba-tk-2026",
                isPublished: true,
                sections: {
                    create: [
                        {
                            type: "TEXT",
                            order: 0,
                            text: "Deskripsi kegiatan lomba TK tahun ini.",
                        },
                        {
                            type: "IMAGE",
                            order: 1,
                            columns: 2,
                            images: {
                                create: [
                                    { imagePath: "https://your-storage.com/news/photo1.jpg", order: 0 },
                                    { imagePath: "https://your-storage.com/news/photo2.jpg", order: 1 },
                                ],
                            },
                        },
                        {
                            type: "YOUTUBE",
                            order: 2,
                            youtubeUrl: "https://www.youtube.com/watch?v=xxxxxxx",
                        },
                    ],
                },
            },
        });

        await NewsService.syncNewsSummary(news.id);

        return prismaClient.news.findUniqueOrThrow({
            where: { id: news.id },
            include: {
                sections: {
                    orderBy: { order: "asc" },
                    include: { images: { orderBy: { order: "asc" } } },
                },
            },
        });
    }

    static async createSecondNews() {
        const news = await prismaClient.news.create({
            data: {
                title: "Kegiatan Outing Class TK 2026",
                slug: "kegiatan-outing-class-tk-2026",
                isPublished: true,
                sections: {
                    create: [
                        {
                            type: "TEXT",
                            order: 0,
                            text: "Kegiatan outing class merupakan kegiatan belajar di luar kelas untuk mengenalkan siswa terhadap lingkungan sekitar.",
                        },
                        {
                            type: "IMAGE",
                            order: 1,
                            columns: 3,
                            images: {
                                create: [
                                    {
                                        imagePath: "https://your-storage.com/news/outing1.jpg",
                                        order: 0,
                                    },
                                    {
                                        imagePath: "https://your-storage.com/news/outing2.jpg",
                                        order: 1,
                                    },
                                    {
                                        imagePath: "https://your-storage.com/news/outing3.jpg",
                                        order: 2,
                                    },
                                ],
                            },
                        },
                        {
                            type: "TEXT",
                            order: 2,
                            text: "Siswa mengikuti berbagai aktivitas edukatif yang menyenangkan bersama guru pendamping.",
                        },
                    ],
                },
            },
        });

        await NewsService.syncNewsSummary(news.id);

        return prismaClient.news.findUniqueOrThrow({
            where: {
                id: news.id,
            },
            include: {
                sections: {
                    orderBy: {
                        order: "asc",
                    },
                    include: {
                        images: {
                            orderBy: {
                                order: "asc",
                            },
                        },
                    },
                },
            },
        });
    }

    static async getAll() {
        const news = await prismaClient.news.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: "desc" },
        });

        if (news.length === 0) {
            throw new Error("News not found");
        }

        return news;
    }

    static async getBySlug(slug: string) {
        const news = await prismaClient.news.findUnique({
            where: { slug },
        });

        if (!news) {
            throw new Error("News not found");
        }

        return news;
    }

}
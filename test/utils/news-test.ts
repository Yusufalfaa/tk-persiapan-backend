import { prismaClient } from "../../src/application/database.js";
import { NewsService } from "../../src/services/news-service.js";

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
                id: 1,
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
                id: 2,
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

    static async createDraftNews() {
        const news = await prismaClient.news.create({
            data: {
                id: 3,
                title: "Kegiatan Outing Class",
                slug: "outing-class-2026",
                isPublished: false,
                sections: {
                    create: [
                        {
                            type: "TEXT",
                            order: 0,
                            text: "Ini adalah section excerpt yang lama",
                        },
                        {
                            type: "TEXT",
                            order: 1,
                            text: "Draft rencana outing class ke kebun binatang, masih dalam tahap persiapan.",
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
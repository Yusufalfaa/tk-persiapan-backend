import { NewsSectionType } from "../../src/generated/prisma/client.js";
import { prismaClient } from "../../src/application/database.js";

export class NewsTest {

    static async deleteAll() {
        await prismaClient.news.deleteMany();
    }

    static async createNews() {
        await prismaClient.news.create({
            data: {
                id: 1,
                title: "Berita 1",
                slug: "berita-1",
                thumbnail: "/uploads/news/news-1.jpg",
                excerpt: "Ini adalah ringkasan berita pertama.",
                isPublished: true,
                sections: {
                    create: [
                        {
                            order: 0,
                            type: NewsSectionType.TEXT,
                            text: "Ini adalah ringkasan berita pertama."
                        }
                    ]
                }
            }
        });

        await prismaClient.news.create({
            data: {
                id: 2,
                title: "Berita 2",
                slug: "berita-2",
                thumbnail: "/uploads/news/news-2.jpg",
                excerpt: "",
                isPublished: true,
                sections: {
                    create: [
                        {
                            order: 1,
                            type: NewsSectionType.IMAGE,
                            imagePath: "/uploads/news/content-2.jpg"
                        }
                    ]
                }
            }
        });

        await prismaClient.news.create({
            data: {
                id: 3,
                title: "Berita 3",
                slug: "berita-3",
                thumbnail: "/uploads/news/news-3.jpg",
                excerpt: "",
                isPublished: false,
                sections: {
                    create: [
                        {
                            order: 2,
                            type: NewsSectionType.YOUTUBE,
                            youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        }
                    ]
                }
            }
        });
    }

}
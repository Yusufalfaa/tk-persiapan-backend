import { prismaClient } from "../application/database.js";
import type { DashboardStat } from "../models/dashboard-model.js";

export class DashboardService {
    static async getStats(): Promise<DashboardStat> {
        const [
            totalAdmin,
            totalTeachers,
            totalNews,
            publishedNews,
        ] = await Promise.all([
            prismaClient.admin.count(),

            prismaClient.teacher.count(),

            prismaClient.news.count(),

            prismaClient.news.count({
                where: {
                    isPublished: true,
                },
            }),
        ]);

        return {
            totalAdmin,
            totalTeachers,
            totalNews,
            publishedNews,
        };
    }
}
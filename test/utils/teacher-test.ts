import { prismaClient } from "../../src/application/database.js";

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

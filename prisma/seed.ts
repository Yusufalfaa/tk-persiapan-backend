import "dotenv/config";
import bcrypt from "bcrypt";
import { prismaClient } from "../src/application/database";

async function main() {
    const passwordHash = await bcrypt.hash("admin12345", 10);

    await prismaClient.admin.upsert({
        where: { username: "superadmin" },
        update: {},
        create: {
            username: "superadmin",
            name: "Super Admin",
            passwordHash,
            role: "SUPER_ADMIN",
        },
    });

    await prismaClient.schoolProfile.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: "TK Persiapan",
            vision: "Menjadi sekolah terbaik",
            address: "Jl. Contoh No. 1",
            latitude: -6.2,
            longitude: 106.8,
            googleMapsUrl: "https://maps.google.com/",
            phone: "08123456789",
            email: "info@tkpersiapan.sch.id",
        },
    });

    console.log("Seeding selesai.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });
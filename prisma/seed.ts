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
            vision: "Mewujudkan generasi emas yang sehat, kreatif, mandiri, bernalar kritis, serta menjunjung tinggi nilai-nilai keimanan dan ketakwaan Kepada Tuhan Yang Maha Esa",
            address: "Jl. Panca Warga Empat No.04 7, RT.7/RW.4, Cipinang Besar Sel., Kecamatan Jatinegara, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13410",
            latitude: -6.2,
            longitude: 106.8,
            googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4698.223953328416!2d106.88146539212094!3d-6.235670336498814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3914657d6f9%3A0xc4ad41aacc20abcd!2sTk%20Persiapan!5e1!3m2!1sen!2sid!4v1785991950173!5m2!1sen!2sid",
            phone: "08123456789",
            email: "info@tkpersiapan.sch.id",
            instagramUrl: "https://www.instagram.com/tk_persiapan25/",
            videoUrl: "https://www.youtube.com/embed/NtlzaWr4gpU?si=kms8ou78mQALlp8n"
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
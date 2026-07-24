import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

type UploadFolder = "news" | "teacher" | "school";

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

export function uploadMiddleware(folder: UploadFolder) {

    const storage = multer.diskStorage({

        destination: (req, file, cb) => {
            const uploadPath = path.join(process.cwd(), "uploads", folder);

            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        },

        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
            cb(null, uniqueName);
        }

    });

    return multer({
        storage,

        fileFilter: (req, file, cb) => {

            if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed"));
            }
        },

        limits: {
            fileSize: 2 * 1024 * 1024,
            files: 5,
        }

    });
}
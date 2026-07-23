import multer from "multer";
import path from "path";
import fs from "fs";

type UploadFolder = "news" | "gallery" | "teacher" | "school";

export function uploadMiddleware(folder: UploadFolder) {
    const storage = multer.diskStorage({

    });
}
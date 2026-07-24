import fs from "fs/promises";
import path from "path";

export class StorageService {

    static async exists(filePath: string): Promise<boolean> {
        const absolutePath = path.join(
            process.cwd(),
            filePath
        );
        try {
            await fs.access(absolutePath);
            return true;
        } catch {
            return false;
        }
    };

    static async delete(filePath: string): Promise<void> {
        const absolutePath = path.join(
            process.cwd(),
            filePath
        );

        try {
            await fs.unlink(absolutePath);
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === "ENOENT") {
                return;
            }
            throw error;
        }
    };

    static getPublicPath(folder: string, filename: string): string {
        return `/uploads/${folder}/${filename}`;
    }

}
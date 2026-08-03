import fs from "fs/promises";
import path from "path";

type StorageFolder =
    | "news"
    | "teachers";

export class StorageService {

    private static getAbsolutePath(filePath: string): string {
        return path.join(
            process.cwd(),
            filePath.replace(/^\/+/, "")
        );
    }


    static async exists(filePath: string): Promise<boolean> {
        try {
            await fs.access(
                this.getAbsolutePath(filePath)
            );

            return true;
        } catch {
            return false;
        }
    }


    static async delete(filePath?: string | null): Promise<void> {
        if (!filePath) {
            return;
        }

        try {
            await fs.unlink(
                this.getAbsolutePath(filePath)
            );
        } catch(error) {

            if (
                (error as NodeJS.ErrnoException).code === "ENOENT"
            ) {
                return;
            }

            throw error;
        }
    }


    static async deleteMany(filePaths: string[]): Promise<void> {
        await Promise.all(
            filePaths.map(filePath => this.delete(filePath))
        );
    }


    static getPublicPath(
        folder: StorageFolder,
        filename: string
    ): string {
        return `uploads/${folder}/${filename}`;
    }

    static async deleteAllInFolder(folder: StorageFolder): Promise<void> {
    const folderPath = path.join(
        process.cwd(),
        "uploads",
        folder
    );

    try {
        const files = await fs.readdir(folderPath);

        await Promise.all(
            files.map(file =>
                fs.unlink(path.join(folderPath, file))
            )
        );
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return;
        }

        throw error;
    }
}
}
import fs from "fs/promises";
import path from "path";

type StorageFolder =
    | "news"
    | "teachers";

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

    static async delete(filePath?: string | null): Promise<void> {
        if(!filePath){
            return;
        }

        const absolutePath = path.join(
            process.cwd(),
            filePath
        );

        try {
            await fs.unlink(absolutePath);
        } catch(error){

            if(
                (error as NodeJS.ErrnoException).code === "ENOENT"
            ){
                return;
            }

            throw error;
        }
    };

    static async deleteMany(filePaths: string[]): Promise<void> {
        await Promise.all(
            filePaths.map(filePath => this.delete(filePath))
        );
    }


    static getPublicPath(folder: StorageFolder, filename: string): string {
        return `/uploads/${folder}/${filename}`;
    }

}
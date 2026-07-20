import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { logger } from "./logging.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaMariaDb(databaseUrl);

export const prismaClient = new PrismaClient({ 
    adapter,
    log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

prismaClient.$on("error", (e) => {
    logger.error({
        message: e.message,
        target: e.target
    });
});

prismaClient.$on("warn", (e) => {
    logger.warn(e);
})

prismaClient.$on("info", (e) => {
    logger.info(e);
})

prismaClient.$on("query", (e) => {
    logger.debug({
        query: e.query,
        params: e.params,
        duration: `${e.duration} ms`
    });
});
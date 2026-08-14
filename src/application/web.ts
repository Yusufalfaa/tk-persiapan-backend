import express from "express"
import cors from "cors";
import { publicRouter } from "../routers/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { apiRouter } from "../routers/api.js";
import path from "path";

export const web = express();

web.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

web.use(express.json());

web.use(
    "/storage",
    express.static(path.resolve(process.env.STORAGE_PATH!))
);

web.use(publicRouter)
web.use(apiRouter)

web.use(errorMiddleware)
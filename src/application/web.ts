import express from "express"
import cors from "cors";
import { publicRouter } from "../routers/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { apiRouter } from "../routers/api.js";

export const web = express();

web.use(cors({
    origin: "http://localhost:5173",
}));

web.use(express.json());

web.use("/uploads", express.static("uploads"));

web.use(publicRouter)
web.use(apiRouter)

web.use(errorMiddleware)
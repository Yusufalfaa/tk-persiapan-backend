import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { AuthController } from "../controllers/auth-controller.js";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// Auth API
apiRouter.get("/api/auth/me", AuthController.get);
apiRouter.put("/api/auth/me", AuthController.update);
apiRouter.post("/api/auth/logout", AuthController.logout);
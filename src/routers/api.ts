import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { AuthController } from "../controllers/auth-controller.js";
import { SchoolController } from "../controllers/school-controller.js";
import { TeacherController } from "../controllers/teacher-controller.js";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// Auth API
apiRouter.get("/api/auth/me", AuthController.get);
apiRouter.put("/api/auth/me", AuthController.update);
apiRouter.post("/api/auth/logout", AuthController.logout);

// School API
apiRouter.put("/api/school", SchoolController.update)

// Teacher API
apiRouter.post("/api/teachers", TeacherController.create)
apiRouter.put("/api/teachers/:id", TeacherController.update)
apiRouter.delete("/api/teachers/:id", TeacherController.delete)
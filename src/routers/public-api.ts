import  express  from "express";
import { AuthController } from "../controllers/auth-controller.js";
import { SchoolController } from "../controllers/school-controller.js";
import { TeacherController } from "../controllers/teacher-controller.js";
import { NewsController } from "../controllers/news-controller.js";

export const publicRouter = express.Router();

// Auth Login
publicRouter.post("/api/auth/login", AuthController.login)

// School Profile
publicRouter.get("/api/school", SchoolController.get)

// Teachers
publicRouter.get("/api/teachers", TeacherController.getList)
publicRouter.get("/api/teachers/:id", TeacherController.get)

// News
publicRouter.get("/api/news", NewsController.getList)
publicRouter.get("/api/news/:slug", NewsController.getDetail)
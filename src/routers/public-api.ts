import  express  from "express";
import { AuthController } from "../controllers/auth-controller.js";
import { SchoolController } from "../controllers/school-controller.js";

export const publicRouter = express.Router();
publicRouter.post("/api/auth/login", AuthController.login)

publicRouter.get("/api/school", SchoolController.get)
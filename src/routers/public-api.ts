import  express  from "express";
import { AuthController } from "../controllers/auth-controller.js";

export const publicRouter = express.Router();
publicRouter.post("/api/auth/login", AuthController.login)
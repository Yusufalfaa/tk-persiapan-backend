import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { AuthController } from "../controllers/auth-controller.js";
import { SchoolController } from "../controllers/school-controller.js";
import { TeacherController } from "../controllers/teacher-controller.js";
import { requireRole } from "../middleware/role-middleware.js";
import { AdminController } from "../controllers/admin-controller.js";
import { uploadMiddleware } from "../middleware/upload-middleware.js";
import { NewsController } from "../controllers/news-controller.js";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// Auth API
apiRouter.get("/api/auth/me", AuthController.get);
apiRouter.put("/api/auth/me", AuthController.update);
apiRouter.post("/api/auth/logout", AuthController.logout);

// School API
apiRouter.put("/api/admin/school", SchoolController.update);

// Teacher API
apiRouter.post("/api/admin/teachers", uploadMiddleware("teachers").single("photo"), TeacherController.create);
apiRouter.put("/api/admin/teachers/:id", uploadMiddleware("teachers").single("photo"), TeacherController.update);
apiRouter.delete("/api/admin/teachers/:id", TeacherController.delete)

// News
apiRouter.get("/api/admin/news", NewsController.getAdminList);
apiRouter.get("/api/admin/news/:slug", NewsController.getAdminDetail);
apiRouter.post("/api/admin/news", NewsController.createNews);
apiRouter.post("/api/admin/news/:id", NewsController.updateNews);


// Admins
apiRouter.get("/api/admin", requireRole("SUPER_ADMIN"),AdminController.getList);
apiRouter.get("/api/admin/:id", requireRole("SUPER_ADMIN"),AdminController.get);
apiRouter.post("/api/admin", requireRole("SUPER_ADMIN"), AdminController.create);
apiRouter.patch("/api/admin/:id/reset-password", requireRole("SUPER_ADMIN"), AdminController.resetPassword);
apiRouter.delete("/api/admin/:id", requireRole("SUPER_ADMIN"), AdminController.delete);
import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

//  Protected routes
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);
router.post("/change-password", authenticate, authController.changePassword);

export default router;

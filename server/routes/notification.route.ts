import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import { getNotification, updateNotification } from "../controllers/notification.controller";
const router = express.Router();

router.get("/get-notifications", isAuthenticated, authorizeRoles('admin'), getNotification )
router.put("/update-notification/:id", isAuthenticated, authorizeRoles('admin'), updateNotification )

export default router
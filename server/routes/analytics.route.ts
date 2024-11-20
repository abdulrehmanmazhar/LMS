import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllers/analytics.controller";
const router = express.Router();

router.get("/get-user-analytics", isAuthenticated, authorizeRoles("admin"), getUserAnalytics);
router.get("/get-course-analytics", isAuthenticated, authorizeRoles("admin"), getCourseAnalytics);
router.get("/get-order-analytics", isAuthenticated, authorizeRoles("admin"), getOrderAnalytics);



export default router
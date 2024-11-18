import express  from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { editCourse, uploadCourse } from "../controllers/course.controller";
const router = express.Router();

router.post("/create-course", isAuthenticated, authorizeRoles("admin"), uploadCourse );
router.put("/edit-course/:id", isAuthenticated, authorizeRoles("admin"), editCourse );

export default router;
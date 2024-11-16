import express  from "express";
import { activateUser, LoginUser, logoutUser, registrationUser } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";
const router = express.Router();


router.post("/registration", registrationUser);
router.post("/activate-user", activateUser)
router.post("/login", LoginUser);
router.post("/logout", isAuthenticated, logoutUser);

export default router
import express  from "express";
import { activateUser, getUserInfo, LoginUser, logoutUser, registrationUser, socialAuth, updateAccessToken } from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const router = express.Router();


router.post("/registration", registrationUser);
router.post("/activate-user", activateUser)
router.post("/login", LoginUser);
router.get("/logout", isAuthenticated, authorizeRoles('admin'), logoutUser);
router.get("/refresh", updateAccessToken)
router.get("/me", isAuthenticated, getUserInfo)
router.post("/social-auth", socialAuth)
export default router
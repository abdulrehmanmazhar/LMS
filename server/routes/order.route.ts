import express  from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import { createOrder, fetchAllOrders } from "../controllers/order.controller";

const router = express.Router();

router.post('/create-order', isAuthenticated, createOrder)
router.get("/get-all-orders-admin",isAuthenticated, authorizeRoles("admin"), fetchAllOrders );

export default router;
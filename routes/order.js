import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
import {
  placeOrder,
  myOrders,
  getOrderDetails,
  AdminOrders,
  processOrder,
  placeOrderOnline,
  paymentVerification
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/createorder",isAuthenticated, placeOrder);

router.post("/createorderonline",isAuthenticated, placeOrderOnline);

router.post("/paymentverification", isAuthenticated, paymentVerification);

router.get("/myorders", isAuthenticated, myOrders);

router.get("/order/:id", isAuthenticated, getOrderDetails);



// Admin Routes...
router.get("/admin/orders", isAuthenticated, isAdmin, AdminOrders);

router.get("/admin/order/:id", isAuthenticated, isAdmin, processOrder);




export default router;

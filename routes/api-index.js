import express from "express";
const router = express.Router();

import apiAdminRoutes from "./api-admin.js";
import apiShopRoutes from "./api-shop.js";

router.use("/admin", apiAdminRoutes);
router.use("/shop", apiShopRoutes);

export default router;

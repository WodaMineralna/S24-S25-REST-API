import express from "express";
const router = express.Router();

import apiAdminRoutes from "./api-admin.js";

router.use("/admin", apiAdminRoutes);

export default router;

import express from "express";
const router = express.Router();

// !
// ? catchErrAsync needed?

import isAuthed from "../middleware/isAuthed.js";
import * as apiShopController from "../controllers/api-shop.js";
import { validateObjectId } from "../utils/validation.js";
import apiHandleValidation from "../middleware/apiHandleValidation.js";

router.get("/products", apiShopController.apiGetProducts);

router.get(
  "/products/:productId",
  isAuthed(),
  validateObjectId("productId"),
  apiHandleValidation(),
  apiShopController.apiGetProductById
);

router.get("/cart", isAuthed(), apiShopController.apiGetCart);

router.post(
  "/cart",
  isAuthed(),
  validateObjectId("productId"),
  apiHandleValidation(),
  apiShopController.apiAddToCart
);

router.delete(
  "/cart/:productId",
  isAuthed(),
  validateObjectId("productId"),
  apiHandleValidation(),
  apiShopController.apiRemoveFromCart
);

router.get("/orders", isAuthed(), apiShopController.apiGetOrders);

router.post("/orders", isAuthed(), apiShopController.apiCreateOrder);

router.get("/orders/:orderId", isAuthed(), apiHandleValidation(), apiShopController.apiGetOrderById);

export default router;

import express from "express";
const router = express.Router();

// !
// ? catchErrAsync needed?

import isAuthed from "../middleware/isAuthed.js";
import * as apiAdminController from "../controllers/api-admin.js";
import {
  validateObjectId,
  validateAddProductForm,
  validateEditProductForm,
} from "../utils/validation.js";
import apiHandleValidation from "../middleware/apiHandleValidation.js";
import handleValidation from "../middleware/handleValidation.js";

router.get("/products", isAuthed(), apiAdminController.apiGetProducts);

router.get(
  "/products/:productId",
  isAuthed(),
  validateObjectId("productId"),
  apiHandleValidation(),
  apiAdminController.apiGetProductById
);

router.post(
  "/products",
  validateAddProductForm(),
  handleValidation(),
  apiAdminController.apiAddProduct
);

router.patch(
  "/products/:productId",
  validateEditProductForm("productId"),
  apiHandleValidation(),
  apiAdminController.apiEditProduct
);

router.delete(
  "/products/:productId",
  isAuthed(),
  validateObjectId("productId"),
  apiHandleValidation(),
  apiAdminController.apiDeleteProduct
);

export default router;

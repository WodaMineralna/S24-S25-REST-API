import express from "express";
const router = express.Router();

// !
// ? catchErrAsync needed?

import isAuthed from "../middleware/isAuthed.js";
import * as apiAuthController from "../controllers/api-auth.js";
import {
  validateObjectId,
  validateAddProductForm,
  validateEditProductForm,
} from "../utils/validation.js";
import apiHandleValidation from "../middleware/apiHandleValidation.js";


// * routes will be added after JWT utils and middleware implementation

export default router;

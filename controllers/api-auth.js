import {
  loginUser,
  singupUser,
  resetPassword,
  validateToken,
  updatePassword,
} from "../models/auth.js";

const PLACEHOLDER_DETAILS = { cause: null, message: "Something went wrong..." };
const PRODUCTS_PER_PAGE = process.env.PRODUCTS_PER_PAGE || 3;

import { createLogger } from "../utils/index.js";
const log = createLogger(import.meta.url);

// * controllers will be added after JWT utils and middleware implementation

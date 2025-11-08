import Product from "../models/product.js";

import PDFDocument from "pdfkit-table";
import { fillInvoicePDF } from "../utils/index.js";

import { createLogger } from "../utils/index.js";
const log = createLogger(import.meta.url);

const PLACEHOLDER_DETAILS = { cause: null, message: "Something went wrong..." };
const PRODUCTS_PER_PAGE = process.env.PRODUCTS_PER_PAGE || 3;

export const apiGetProducts = async (req, res, next) => {
  try {
    log("info", "Reached GET /api/shop/products"); // DEBUGGING

    const page = req.query.page || 1;

    // * req.user._id will be deleted soon and JWT auth will be implemented
    const { products, paginationData } = await Product.fetchAll(
      page,
      PRODUCTS_PER_PAGE,
      req.user._id
    );

    return res.status(200).json({ ok: true, products });
  } catch (error) {
    return next(error);
  }
};

export const apiGetProductById = async (req, res, next) => {
  try {
    log("info", "Reached GET /api/shop/products/:productId"); // DEBUGGING

    const id = req.params.productId;
    const {
      didSucceed,
      details = PLACEHOLDER_DETAILS,
      product = {},
    } = await Product.findProductById(id);

    if (!didSucceed) {
      return res.status(404).json({ ok: false, details });
    }

    return res.status(200).json({ ok: true, product });
  } catch (error) {
    return next(error);
  }
};

export const apiGetCart = async (req, res, next) => {
  try {
    log("info", "Reached GET /api/shop/cart"); // DEBUGGING

    const { details, cartItems } = await req.user.getCart();

    return res
      .status(200)
      .json({ ok: true, cartItems, warningDetails: details });
  } catch (error) {
    return next(error);
  }
};

export const apiAddToCart = async (req, res, next) => {
  try {
    log("info", "Reached POST /api/shop/cart"); // DEBUGGING

    const id = req.body.productId;
    const { didSucceed, details = PLACEHOLDER_DETAILS } =
      await req.user.addToCart(id);

    // TODO - add proper status codes
    if (!didSucceed) {
      return res.status(404).json({ ok: false, details });
    }

    return res.status(201).json({ ok: true, details });
  } catch (error) {
    return next(error);
  }
};

export const apiRemoveFromCart = async (req, res, next) => {
  try {
    log("info", "Reached DELETE /api/shop/cart/:productId"); // DEBUGGING

    const id = req.params.productId;
    const { didSucceed, details = PLACEHOLDER_DETAILS } =
      await req.user.deleteItemFromCart(id);

    // TODO - add proper status codes
    if (!didSucceed) {
      return res.status(404).json({ ok: false, details });
    }

    return res.status(204).json({ ok: true, details });
  } catch (error) {
    return next(error);
  }
};

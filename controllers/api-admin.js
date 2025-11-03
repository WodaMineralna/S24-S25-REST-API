import Product from "../models/product.js";

const PLACEHOLDER_DETAILS = { cause: null, message: "Something went wrong..." };
const PRODUCTS_PER_PAGE = process.env.PRODUCTS_PER_PAGE || 3;

import { createLogger } from "../utils/index.js";
const log = createLogger(import.meta.url);

export const apiGetProducts = async (req, res, next) => {
  try {
    log("info", "Reached GET /api/admin/products"); // DEBUGGING

    const page = req.query.page || 1;

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
    log("info", "Reached GET /api/admin/products/:productId"); // DEBUGGING

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

export const apiDeleteProduct = async (req, res, next) => {
  try {
    log("info", "Reached DELETE /api/admin/products/:productId"); // DEBUGGING
    // const id = req.body.productId; // ! will be brought back later, currently using req.params for debugging purposes
    const id = req.params.productId;

    // ! Session-based auth (req.user._id) will stay temporarily, before I implement JWT authentication
    const { didSucceed, details = PLACEHOLDER_DETAILS } =
      await Product.deleteProduct(id, req.user._id);

    if (!didSucceed) {
      return res.status(404).json({ ok: false, details });
    }

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

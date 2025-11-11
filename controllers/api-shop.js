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

export const apiGetOrders = async (req, res, next) => {
  try {
    log("info", "Reached GET /api/shop/orders"); // DEBUGGING

    const orders = await req.user.getOrders();

    return res.status(200).json({ ok: true, orders });
  } catch (error) {
    return next(error);
  }
};

export const apiCreateOrder = async (req, res, next) => {
  try {
    log("info", "Reached POST /api/shop/orders"); // DEBUGGING

    const { didSucceed, details = PLACEHOLDER_DETAILS } =
      await req.user.addOrder();

    // TODO - add proper status codes
    if (!didSucceed) {
      return res.status(404).json({ ok: false, details });
    }

    return res.status(200).json({ ok: true, details });
  } catch (error) {
    return next(error);
  }
};

export const apiGetOrderById = async (req, res, next) => {
  try {
    log("info", "Reached GET /api/shop/orders/:orderId"); // DEBUGGING

    const orderId = req.params.orderId;
    const {
      didSucceed,
      details = PLACEHOLDER_DETAILS,
      invoice,
    } = await req.user.getInvoice(orderId, req.user._id);

    // TODO - add proper status codes
    if (!didSucceed) {
      return res.status(404).json({ ok: false, details });
    }
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=${invoice.invoiceName}`
    );

    doc.pipe(res);
    await fillInvoicePDF(doc, invoice);
    doc.end();

    doc.on("error", (err) => {
      log(
        "error",
        `Stream error for invoice PDF "${invoiceName}": ${err.message}`
      );
      if (!res.headersSent) {
        log("error", `Error streaming invoice PDF: ${err.message}`);
        res
          .status(500)
          .json({
            ok: false,
            details: `Error streaming invoice PDF: ${err.message}`,
          });
      }
    });
  } catch (error) {
    return next(error);
  }
};

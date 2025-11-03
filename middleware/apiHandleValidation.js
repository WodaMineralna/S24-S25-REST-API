import { validationResult } from "express-validator";
import { createLogger, removeFile } from "../utils/index.js";

const log = createLogger(import.meta.url);

export default function apiHandleValidation() {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const errorMessage = errors.errors.map(
      (error) => new Object({ cause: error.path, message: error.msg })
    ); // format to an array

    log(
      "warn",
      `Input validation errors:\n${JSON.stringify(errorMessage, null, 2)}`
    );

    // TODO set correct res.status codes
    return res.status(400).json({ ok: false, errorMessage });
  };
}

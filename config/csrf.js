import csrf from "csurf";
const csrfProtection = csrf();

export default function (req, res, next) {
  if (req.originalUrl.startsWith("/api")) return next();
  return csrfProtection(req, res, next);
}

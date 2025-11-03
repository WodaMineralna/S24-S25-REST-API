export default (req, res, next) => {
  res.locals.loggedIn = req.session.loggedIn;
  if (!req.originalUrl.startsWith("/api"))
    res.locals.csrfToken = req.csrfToken();
  res.locals.oldInput = req.body.oldInput ?? {};
  res.locals.errorMessage = req.flash("error");
  res.locals.infoMessage = req.flash("info");
  next();
};

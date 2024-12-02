class AuthMiddleware {
  handle(req, res, next) {
    console.log(req.url);
    
    if (req.session.user) {
      if (req.url == "/login" || req.url == "/register") {
        res.redirect("/");
      } else {
        next();
      }
    } else {
      if (req.url == "/login" || req.url == "/register") {
        next();
      } else {
        req.session.error = "Access denied!";
        res.redirect("/login");
      }
    }
  }
}

module.exports = AuthMiddleware;

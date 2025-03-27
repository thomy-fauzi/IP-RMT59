async function isAdmin(req, res, next) {
  try {
    if (req.user.role === "User") {
      return next({ name: "Forbidden", message: "Forbidden access" });
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { isAdmin };

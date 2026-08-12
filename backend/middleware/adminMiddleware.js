const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403);
  throw new Error("Chỉ admin mới có quyền thực hiện thao tác này.");
};

module.exports = { adminOnly };

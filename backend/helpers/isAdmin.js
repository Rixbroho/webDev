const isAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res
    .status(403)
    .json({ success: false, message: "Access denied: Admins only" });
};

export default isAdmin;

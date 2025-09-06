const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (without password field)
      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (err) {
      return res.status(401).json({ msg: "Invalid or expired token" });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }
};

module.exports = protect;

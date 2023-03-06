const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const [authType, token] = authHeader.split(" ");

  if (authType !== "Bearer") {
    return res.status(401).json({ message: "Invalid authorization type" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.userInfo = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid JWT" });
  }
};

exports.verifyRole =
  (...allowedRoles) =>
  async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          message: "Authorization header not found",
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (!decoded.userInfo || !decoded.userInfo.role) {
        return res.status(403).json({
          message: "Invalid token payload",
        });
      }

      const userRole = decoded.userInfo.role;
      const requiredRole = [...allowedRoles];

      if (!requiredRole.includes(userRole)) {
        return res.status(403).json({
          message: "Insufficient privileges",
        });
      }

      req.user = decoded.userInfo;
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({
        message: "Invalid token",
      });
    }
  };

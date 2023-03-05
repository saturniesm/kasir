const userModel = require("../models/index").user;
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyRole =
  (...allowedRoles) =>
  async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await userModel.findOne({
        where: {
          email: decoded.userInfo.email,
        },
      });
      
      if (!user)
        return res.status(401).json({
          message: "User not found",
        });

      const roleArray = [...allowedRole];
      if (!roleArray.includes(user.role)) {
        return res.status(401).send("Unauthorized");
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).send("Unauthorized");
    }
  };

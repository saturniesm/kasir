const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateAccessToken = (user) => {
  const expirationTime = Date.now() + parseInt(process.env.JWT_EXPIRATION);
  return jwt.sign({ userInfo: user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: expirationTime,
  })
}

exports.generateRefreshToken = (user) => {
  const expirationTime = Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRATION);
  return jwt.sign(
    { username: user.username, email: user.email, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: expirationTime }
  )
}

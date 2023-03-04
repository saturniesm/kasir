const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
    return jwt.sign({ userInfo: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
};

exports.generateRefreshToken = (user) => {
    return jwt.sign({ username: user.username, email: user.email, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
};
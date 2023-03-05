const jwt = require('jsonwebtoken');

require('dotenv').config

// Verifed user login or not
exports.verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    // TODO Pelajarin ini
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401).json({
        message: "Unauthorized"
    })
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 
        process.env.ACCESS_TOKEN_SECRET, 
        (error, decoded) => {
        console.log(error)
        if(error) return res.sendStatus(403)
        req.email = decoded.userInfo.email
        req.role = decoded.userInfo.role
        next();
        }
    )
}
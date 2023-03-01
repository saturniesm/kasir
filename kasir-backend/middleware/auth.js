const jwt = require('jsonwebtoken');

exports.verifyToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return response.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if(error) return response.sendStatus(403);
        request.email = decoded.email;
        next();
    })
}
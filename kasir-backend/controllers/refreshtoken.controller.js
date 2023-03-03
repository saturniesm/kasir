const userModel = require('../models/index').user
const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.handleRefreshToken = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) return res.sendStatus(401)
        const user = await userModel.findAll({
            where:{
                refresh_token: refreshToken
            }
        })

        if(!user) return res.sendStatus(403)
        jwt.verify(
            refreshToken, 
            process.env.REFRESH_TOKEN_SECRET, 
            (err, decoded) => {
            if(err) return res.sendStatus(403);
            const username = decoded.username;
            const email = decoded.email;
            const role = user.role
            const accessToken = jwt.sign({
                "userInfo": {
                    "username": username,
                    "email": email,
                    "role": role   
                }
            }, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: Date.now() + process.env.JWT_EXPIRATION
            });
            res.json({ accessToken });
        });
    } catch (error) {
        res.status(401).json({
            'message': 'Wrong password'
        })
    }
}
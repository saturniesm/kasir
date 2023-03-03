// load library express
const express = require('express')

// initiate object that instance of express
const app = express()

// allow to read 'request with json type
app.use(express.json())

const authController = require('../controllers/auth.controller')
const refreshTokenController = require('../controllers/refreshtoken.controller')

app.post("/login", authController.login)
app.delete("/logout", authController.logout)
app.get("/token", refreshTokenController.handleRefreshToken)

module.exports = app

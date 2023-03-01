// load library express
const express = require("express");

// initiate object that instance of express
const app = express();

// allow to read 'request with json type
app.use(express.json());

const authController = require("../controllers/auth.controller");
app.post("/login", authController.login);
app.delete("/logout", authController.logout);
app.get("/token", authController.refreshToken);

module.exports = app;

const express = require("express");
const app = express();

app.use(express.json());

const paymentController = require("../controllers/payment.controller");

app.put("/pay/:id", paymentController.createPayment);

module.exports = app;

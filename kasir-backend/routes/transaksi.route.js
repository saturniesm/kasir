const express = require("express");
const app = express();

app.use(express.json());

const transaksiController = require("../controllers/transaksi.controller");

app.post("/", transaksiController.addTransaksi);
app.put("/edit/:id", transaksiController.updateTransaksi);
app.put("/pay/:id_transaksi", transaksiController.createPayment);
app.delete("/:id", transaksiController.deleteTransaksi);
app.get("/get/:id_transaksi", transaksiController.findOneTransaksi)

module.exports = app;

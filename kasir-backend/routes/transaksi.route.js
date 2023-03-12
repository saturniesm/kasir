const express = require("express");
const app = express();

app.use(express.json());

const transaksiController = require("../controllers/transaksi.controller");
const verify = require("../middleware/verify").verifyRole;

app.get(
  "/get",
  verify("admin", "kasir", "manager"),
  transaksiController.getAllTransaksi
);

app.post(
  "/add",
  verify("admin", "kasir", "manager"),
  transaksiController.createTransaksi
);

app.put(
  "/edit/:id_transaksi",
  verify("admin", "kasir", "manager"),
  transaksiController.updateTransaksi
);

app.put(
  "/pay/:id_transaksi",
  verify("admin", "kasir", "manager"),
  transaksiController.createPayment
);

app.delete(
  "/delete/:id_transaksi",
  verify("admin", "kasir", "manager"),
  transaksiController.deleteTransaksi
);



module.exports = app;

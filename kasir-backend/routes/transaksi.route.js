const express = require("express");
const app = express();

app.use(express.json());

const transaksiController = require("../controllers/transaksi.controller");
const verify = require("../middleware/verify").verifyRole;

app.post(
  "/",
  verify("admin", "kasir", "manager"),
  transaksiController.addTransaksi
);

app.put(
  "/edit/:id",
  verify("admin", "kasir", "manager"),
  transaksiController.updateTransaksi
);

app.put(
  "/pay/:id_transaksi",
  verify("admin", "kasir", "manager"),
  transaksiController.createPayment
);

app.delete(
  "/:id",
  verify("admin", "kasir", "manager"),
  transaksiController.deleteTransaksi
);

app.get(
  "/get/:id_transaksi",
  verify("admin", "kasir", "manager"),
  transaksiController.findOneTransaksi
);

module.exports = app;

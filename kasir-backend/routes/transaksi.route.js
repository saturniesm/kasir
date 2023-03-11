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
  "/:id",
  verify("admin", "kasir", "manager"),
  transaksiController.deleteTransaksi
);

app.get(
  "/transaksi-kasir",
  verify("admin", "kasir", "manager"),
  transaksiController.getTransaksiByKasir
);

app.get(
  "/fav-menu",
  verify("admin", "kasir", "manager"),
  transaksiController.getmostFavoriteProduct
);

app.get(
  "/list-menu",
  verify("admin", "kasir", "manager"),
  transaksiController.getListFavoriteProduct
);

app.get(
  "/transaksi-harian",
  verify("admin", "kasir", "manager"),
  transaksiController.getDailyTransaksi
);

app.get(
  "/transaksi-bulanan",
  verify("admin", "kasir", "manager"),
  transaksiController.getMonthlyTransaksi
);

app.get(
  "/transaksi-tahunan",
  verify("admin", "kasir", "manager"),
  transaksiController.getYearlyTransaksi
);


module.exports = app;

const express = require("express");
const app = express();

app.use(express.json());

const controller = require("../controllers/report.controller");
const verify = require("../middleware/verify").verifyRole;

app.get(
  "/transaksi-kasir",
  verify("admin", "kasir", "manager"),
  controller.getTransaksiByKasir
);

app.get(
  "/fav-menu",
  verify("admin", "kasir", "manager"),
  controller.getmostFavoriteProduct
);

app.get(
  "/list-menu",
  verify("admin", "kasir", "manager"),
  controller.getListFavoriteProduct
);

app.get(
  "/transaksi-harian",
  verify("admin", "kasir", "manager"),
  controller.getDailyTransaksi
);

app.get(
  "/transaksi-bulanan",
  verify("admin", "kasir", "manager"),
  controller.getMonthlyTransaksi
);

app.get(
  "/transaksi-tahunan",
  verify("admin", "kasir", "manager"),
  controller.getYearlyTransaksi
);

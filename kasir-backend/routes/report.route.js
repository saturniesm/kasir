const express = require("express");
const app = express();

app.use(express.json());

const controller = require("../controllers/report.controller");
const verify = require("../middleware/verify").verifyRole;

app.get(
  "/transaksi-kasir/:id_user",
  verify("manager", "kasir"),
  controller.getTransaksiByKasir
);

app.get(
  "/fav-menu",
  verify("manager"),
  controller.getmostFavoriteProduct
);

app.get(
  "/list-menu",
  verify("manager"),
  controller.getListFavoriteProduct
);


app.get("/transaksi-tanggal", verify("manager"), controller.rangeDate);

app.get("/pendapatan", verify("manager"), controller.getRevenue);

module.exports = app;

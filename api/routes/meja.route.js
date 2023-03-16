// load library express
const express = require("express");

// initiate object that instance of express
const app = express();

// allow to read 'request with json type
app.use(express.json());

const mejaController = require("../controllers/meja.controller");
const verify = require("../middleware/verify").verifyRole;

app.get("/get", verify("admin", "kasir"), mejaController.getAllMeja);

app.get(
  "/get/:id_meja",
  verify("admin", "kasir"),
  mejaController.getOneMeja
);

app.post("/add", verify("admin", "kasir"), mejaController.addMeja);

app.put(
  "/edit/:id_meja",
  verify("admin", "kasir"),
  mejaController.updateMeja
);

app.delete(
  "/delete/:id_meja",
  verify("admin", "kasir"),
  mejaController.deleteMeja
);

app.put(
  "/edit-status/:id_meja",
  verify("admin", "kasir"),
  mejaController.updateStatusMeja
);

app.get(
  "/meja-tersedia",
  verify("admin", "kasir"),
  mejaController.getAvailableMeja
);

app.post(
  "/status-meja",
  verify("admin", "kasir"),
  mejaController.getStatusMeja
);

module.exports = app;

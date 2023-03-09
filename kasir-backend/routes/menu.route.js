const express = require("express");
const app = express();

app.use(express.json());

const menuController = require("../controllers/menu.controller");
const { upload } = require("../middleware/uploudFile");
const verify = require("../middleware/verify").verifyRole;

app.get("/get", verify("admin"), menuController.getAllMenu);

app.get("/get/:id_menu", verify("admin"), menuController.getOneMenu);

app.post(
  "/add",
  verify("admin"),
  upload.single("gambar"),
  menuController.addMenu
);

app.put("/edit/:id_menu", verify("admin"), menuController.updateMenu);

app.delete("/delete/:id_menu", verify("admin"), menuController.deleteMenu);

app.get("/nama-menu", verify("admin"), menuController.getMenuByName);

app.get("/jenis-menu/:jenis", verify("admin"), menuController.filterByCategory);

module.exports = app;

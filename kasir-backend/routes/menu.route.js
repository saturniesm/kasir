const express = require("express");
const app = express();

app.use(express.json());

const menuController = require("../controllers/menu.controller");
const upload = require(`../controllers/upload-cover`).single(`cover`);

app.get("/", menuController.getAllMenu);
app.get("/:id_menu", menuController.getOneMenu);
app.post("/add", [upload], menuController.addMenu);
app.post("/find", menuController.findMenu);
app.put("/:id_menu", menuController.updateMenu);
app.delete("/:id_menu", menuController.deleteMenu);

module.exports = app;

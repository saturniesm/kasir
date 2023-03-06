// load library express
const express = require("express");

const app = express();

app.use(express.json());

const userController = require("../controllers/user.controller");
const verify = require('../middleware/verify');

app.get(
  "/",
  verify.verifyRole("admin","manager"),
  userController.getAllUser
);

app.get(
  "/:id_user", 
  verify.verifyRole("admin", "manager"),
  userController.getOneUser
);

app.post(
  "/add", 
  verify.verifyRole("admin"), 
  userController.addUser
);

app.post(
  "/find", 
  verify.verifyRole("admin", "manager"),
  userController.searchUser
);

app.put(
  "/:id_user", 
  verify.verifyRole("admin"),
  userController.updateUser
);

app.delete(
  "/:id_user", 
  verify.verifyRole("admin"), 
  userController.deleteUser
);

module.exports = app;

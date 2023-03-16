// load library express
const express = require("express");

const app = express();

app.use(express.json());

const userController = require("../controllers/user.controller");
const verify = require("../middleware/verify");

app.get(
  "/get",
  verify.verifyRole("admin"),
  userController.getAllUser
);

app.get(
  "/get/:id_user",
  verify.verifyRole("admin"),
  userController.getOneUser
);

app.post("/add", verify.verifyRole("admin"), userController.addUser);

app.put(
  "/edit/:id_user",
  verify.verifyRole("admin"),
  userController.updateUser
);

app.delete(
  "/delete/:id_user",
  verify.verifyRole("admin"),
  userController.deleteUser
);

app.get("/search-user", verify.verifyRole("admin"), userController.searchUser);

app.put(
  "/update-role/:id_user",
  verify.verifyRole("admin"),
  userController.updateUserRole
);

module.exports = app;

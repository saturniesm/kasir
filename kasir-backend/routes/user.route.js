// load library express
const express = require("express");

// initiate object that instance of express
const app = express();

// allow to read 'request with json type
app.use(express.json());

// load user's controller
const userController = require("../controllers/user.controller");
const verify = require("../middleware/verify");
const role = require("../middleware/verifyRole");

app.get(
  "/",
  verify.verifyJwt,
  role.verifyRole("admin"),
  userController.getAllUser
);
app.get("/:id_user", verify.verifyJwt, userController.getOneUser);
app.post("/add", verify.verifyJwt, userController.addUser);
app.post("/find", verify.verifyJwt, userController.searchUser);
app.put("/:id_user", verify.verifyJwt, userController.updateUser);
app.delete("/:id_user", verify.verifyJwt, userController.deleteUser);

module.exports = app;

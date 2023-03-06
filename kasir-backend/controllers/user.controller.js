const userModel = require("../models/index").user;
const argon2 = require("argon2");

const Op = require("sequelize").Op;

exports.getAllUser = async (request, response) => {
  try {
    let user = await userModel.findAll();
    response.json({
      success: true,
      data: user,
      message: "All user have been loaded",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getOneUser = async (request, response) => {
  try {
    let user = await userModel.findOne({
      where: {
        id_user: request.params.id_user,
      },
    });
    response.json({
      success: true,
      data: user,
      message: "One user has been loaded",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.searchUser = async (request, response) => {
  let keyword = request.body.keyword;
  let user = await userModel.findAll({
    where: {
      [Op.or]: [
        { username: { [Op.substring]: keyword } },
        { email: { [Op.substring]: keyword } },
        { role: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: user,
    message: "Searching success",
  });
};


exports.addUser = async (request, response) => {
  const { nama_user, role, username, email, password, confPassword } = request.body;
  if (password !== confPassword)
    return response.status(400).json({
      msg: "Password dan Confirm Password tidak cocok",
    });
  const hashPassword = await argon2.hash(password);
  try {
    const user = await userModel.create({
      nama_user: nama_user,
      role: role,
      username: username,
      email: email,
      password: hashPassword,
    });
    response.status(201).json({
      succes: true,
      data: user,
      message: "Register Berhasil",
    });
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
}

exports.updateUser = async (request, response) => {
  const hashPassword = await argon2.hash(request.body.password);
  let dataUser = {
    nama_user: request.body.nama_user,
    role: request.body.role,
    username: request.body.username,
    email: request.body.email,
    password: hashPassword,
  };

  let idUser = request.params.id_user;

  userModel
    .update(dataUser, { where: { id_user: idUser } })
    .then((result) => {
      return response.json({
        success: true,
        data: dataUser,
        message: "Data user has been updated",
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.deleteUser = (request, response) => {
  let idUser = request.params.id_user;

  userModel
    .destroy({ where: { id_user: idUser } })
    .then((result) => {
      return response.json({
        success: true,
        message: "Data user has been updated",
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};


// TODO mengubah peran user
/**
 * Mengubah peran user
 * 
 * */ 
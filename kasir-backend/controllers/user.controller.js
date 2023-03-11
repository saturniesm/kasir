const userModel = require("../models/index").user;
const argon2 = require("argon2");

const Op = require("sequelize").Op;

const {
  validatePassword,
  validateRequiredFields,
  checkDuplicates,
  validateEmail,
} = require("../middleware/validation");

const { generateAccessToken } = require("../middleware/token");

exports.getAllUser = async (request, response) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await userModel.findAndCountAll({
      attributes: { exclude: ["password", "refreshToken"] },
      offset,
      limit,
    });

    const totalPages = Math.ceil(count / limit);

    response.status(200).json({
      success: true,
      data: rows,
      total_pages: totalPages,
      current_page: page,
      message: "All users have been loaded",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getOneUser = async (request, response) => {
  try {
    const id_user = request.params.id_user;
    const user = await userModel.findByPk(id_user, {
      attributes: { exclude: ["password", "refreshToken"] },
    });
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    response
      .status(200)
      .json({ success: true, data: user, message: "User has been loaded" });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.searchUser = async (request, response) => {
  try {
    const { q: keyword } = request.query;

    const users = await userModel.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.substring]: keyword } },
          { email: { [Op.substring]: keyword } },
          { role: { [Op.substring]: keyword } },
        ],
      },
    });

    response.json({
      success: true,
      data: users,
      message: `Found ${users.length} users matching "${keyword}"`,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.addUser = async (request, response, next) => {
  try {
    const models = [userModel, userModel];
    const fields = ["email", "username"];

    request.requiredFields = [
      "nama_user",
      "role",
      "username",
      "email",
      "password",
      "confPassword",
    ];

    checkDuplicates(models, fields)(request, response, () => {
      validateRequiredFields(request, response, () => {
        validateEmail(request, response, () => {
          validatePassword(request, response, async () => {
            const { nama_user, role, username, email, password } = request.body;
            const hashPassword = await argon2.hash(password);

            const user = await userModel.create({
              nama_user,
              role,
              username,
              email,
              password: hashPassword,
            });

            const accessToken = generateAccessToken({
              id_user: user.id_user,
              username,
              email,
              role,
            });

            response.status(201).json({
              success: true,
              data: {
                nama_user: user.nama_user,
                username: user.username,
                email: user.email,
                role: user.role,
                token: accessToken,
              },
              message: "User has been added",
            });
          });
        });
      });
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateUser = async (request, response) => {
  try {
    const models = [userModel, userModel];
    const fields = ["email", "username"];

    request.requiredFields = ["nama_user", "username", "email"];

    const { nama_user, role, username, email, password } = request.body;

    const idUser = request.params.id_user;

    checkDuplicates(models, fields)(request, response, () => {
      validateRequiredFields(request, response, () => {
        validateEmail(request, response, async () => {
          const updatedUser = await userModel.findByPk(idUser);
          if (!updatedUser) {
            return response.status(404).json({
              success: false,
              message: "User not found",
            });
          }

          if (password) {
            validatePassword(request, response, async () => {
              const hashPassword = await argon2.hash(password);
              updatedUser.password = hashPassword;
            });
          }

          await updatedUser.update({ nama_user, role, username, email });

          return response.status(201).json({
            success: true,
            data: {
              nama_user: updatedUser.nama_user,
              username: updatedUser.username,
              email: updatedUser.email,
              role: updatedUser.role,
            },
            message: "User has been updated",
          });
        });
      });
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const id_user = req.params.id_user;

    const user = await userModel.findByPk(id_user, {
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteUser = async (request, response) => {
  const idUser = request.params.id_user;

  try {
    const user = await userModel.findByPk(idUser);
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.destroy();

    return response.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

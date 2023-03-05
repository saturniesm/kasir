const userModel = require("../models/index").user;
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const {
  validatePassword,
  validateRequiredFields,
  checkDuplicates,
  validateEmail,
} = require("../middleware/validation");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/token");

// ROLE any user
exports.register = async (request, response, next) => {
  try {
    const models = [userModel, userModel];
    const fields = ["email", "username"];

    request.requiredFields = [
      "nama_user",
      "username",
      "email",
      "password",
      "confPassword",
    ];

    checkDuplicates(models, fields)(request, response, () => {
      validateRequiredFields(request, response, () => {
        validatePassword(request, response, async () => {
          const { nama_user, username, email, password } = request.body;
          const hashPassword = await argon2.hash(password);
          const role = "undefined";

          const user = await userModel.create({
            nama_user,
            role,
            username,
            email,
            password: hashPassword,
          });

          const accessToken = generateAccessToken(username, email, role);

          response.status(201).json({
            success: true,
            data: {
              nama_user: user.nama_user,
              username: user.username,
              email: user.email,
              role: user.role,
              token: accessToken,
            },
            message: "Registration success",
          });
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

// ROLE any user
exports.login = async (request, response) => {
  try {
    request.requiredFields = ["email", "password"];
    validateRequiredFields(request, response, async () => {
      validateEmail(request, response, async () => {
        const { email, password } = request.body;
        const user = await userModel.findOne({ where: { email } });

        if (!user) {
          return response.status(401).json({ message: "Email does not exist" });
        }

        const match = await argon2.verify(user.password, password);

        if (!match) {
          return response.status(401).json({ message: "Wrong password" });
        }

        const { username, email: userEmail, role, id_user } = user;
        const accessToken = generateAccessToken(username, userEmail, role);
        const refreshToken = generateRefreshToken(
          username,
          userEmail,
          role,
          id_user
        );

        // TODO understanding this

        await userModel.update(
          { refresh_token: refreshToken },
          {
            where: { id_user: user.id_user },
          }
        );
        response.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        response.status(200).json({
          success: true,
          data: {
            username,
            email: userEmail,
            token: accessToken,
          },
          message: "Login success",
        });
      });
    });
  } catch (error) {
    response.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = async (request, response) => {
  try {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await userModel.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      return response
        .status(401)
        .json({ message: "Refresh token do not match" });
    }

    await userModel.update(
      { refresh_token: null },
      {
        where: {
          id_user: user.id_user,
        },
      }
    );

    response.clearCookie("refreshToken");

    return response.status(200).json({
      message: "Logout success",
    });
  } catch (error) {
    next(error);
  }
};

exports.handleRefreshToken = async (request, response) => {
  try {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      return response.status(401).json({ message: "Refresh token not found" });
    }
    const user = await userModel.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      return response
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    try {
      const { id_user, username, email, role } = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const accessToken = generateAccessToken(id_user, username, email, role);
      response.json({ accessToken });
    } catch (error) {
      console.error(error);
      response.status(403).json({ error: "Invalid refresh token" });
    }
  } catch (error) {
    console.log(error);
  }
};

/*

Things that i can improve
- Use express-validator (avoid sql injection that currently my own middleware dont cover etc)
- Using a logger with winston
- Is this even best practice including all in one file like this?
- Create a constan for message
*/

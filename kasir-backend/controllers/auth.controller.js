const userModel = require("../models/index").user;
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

exports.login = async (request, response) => {
  try {
    const user = await userModel.findOne({
      where: {
        email: request.body.email,
      },
    });
    const match = await argon2.verify(user.password, request.body.password);
    if (!match)
      return response.status(400).json({
        message: "Wrong Password",
      });

    const id_user = user.id_user;
    const username = user.username;
    const email = user.email;
    const accessToken = jwt.sign(
      {
        id_user,
        username,
        email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const refreshToken = jwt.sign(
      {
        id_user,
        username,
        email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await userModel.update(
      { refresh_token: refreshToken },
      {
        where: {
          id_user: id_user,
        },
      }
    );
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    response.json({ accessToken });
  } catch (error) {
    response.status(404).json({
      message: "Email tidak ditemukan",
    });
  }
};

exports.logout = async (request, response) => {
  const refreshToken = request.cookies.refreshToken;
  if (!refreshToken) return response.sendStatus(204);

  const user = await userModel.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (user) return response.sendStatus(204);

  await userModel.update(
    { refresh_token: null },
    {
      where: {
        id_user: id_user,
      },
    }
  );
  response.clearCookie("refreshToken");
  return response.sendStatus(200);
};

exports.refreshToken = async (request, response) => {
  try {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) return response.sendStatus(401);
    const user = await userModel.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user) return response.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error) return response.sendStatus(403);
        const id_user = user.user_id;
        const username = user.username;
        const email = user.email;
        const accessToken = jwt.sign(
          { id_user, username, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

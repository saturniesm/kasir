const userModel = require("../models/index").user;
const argon2 = require("argon2");
const { validatePassword, validateRequiredFields, checkDuplicates, validateEmail } = require('../middleware/validation');
const {generateAccessToken, generateRefreshToken } = require('../middleware/token');

// ROLE any user
exports.register = async (request, response, next) => {
  try {
    const models = [userModel, userModel];
    const fields = ['email', 'username'];

    request.requiredFields = ['nama_user', 'username', 'email', 'password', 'confPassword'];

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
              token: accessToken
            },
            message: "Registrasi Berhasil",
          });
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

// ROLE any user
exports.login = async (req, res) => {
    try {
        req.requiredFields = ['email', 'password'];
        validateRequiredFields(req, res, async () => {
            validateEmail(req, res, async () => {
                const { email, password } = req.body;
                const user = await userModel.findOne({ where: { email } });
                
                if (!user) {
                    return res.status(401).json({ message: 'Email does not exist' });
                }
                
                const match = await argon2.verify(user.password, password);
                
                if (!match) {
                    return res.status(401).json({ message: 'Wrong password' });
                }
                
                const { username, email: userEmail, role, id_user } = user;
                const accessToken = generateAccessToken(username, userEmail, role);
                const refreshToken = generateRefreshToken(username, userEmail, role, id_user);
            
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000
                });
            
                res.status(200).json({
                    success: true,
                    data: {
                    username,
                    email: userEmail,
                    token: accessToken
                    },
                    message: 'Login Berhasil'
                });
            });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
 };
  
exports.logout = async (request, response) => {
  const refreshToken = request.cookies.refreshToken;
  if(!refreshToken) return response.sendStatus(204);

  const user = await userModel.findOne({
      where:{
          refresh_token: refreshToken
      }
  })
  if(!user) return response.sendStatus(204);
  const id_user = user.id_user
  await userModel.update({refresh_token: null},{
      where:{
          id_user: id_user
      }
  });
  response.clearCookie('refreshToken');
  return response.status(200).json({
      'message': 'Logout'
  })
};



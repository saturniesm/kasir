const userModel = require("../models/index").user;
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { validatePassword, validateRequiredFields, checkDuplicates } = require('../middleware/validation');



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

          const accessToken = jwt.sign({
            "userInfo" :{
                "id_user": user.id_user,
                "username": user.username,
                "email": user.email,
            }
        }, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: Date.now() + process.env.JWT_EXPIRATION
        });

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


exports.login = async (req, res) => {
  
    const {email, password} = req.body
    if(!email || !password) return res.status(400).json({
        'message': 'Email and Passsword are required'
    })
    try{
        const user = await userModel.findOne({
            where:{
                email: req.body.email
            }
        });
        const match = await argon2.verify(user.password, req.body.password);
        if(match) {
            const username = user.username;
            const email = user.email;
            const role = user.role  
            const accessToken = jwt.sign({
                "userInfo" :{
                    "username": username,
                    "email": email,
                    "role": role
                }
            }, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: Date.now() + process.env.JWT_EXPIRATION
            });

            const refreshToken = jwt.sign({
                username, 
                email,
                role
            }, process.env.REFRESH_TOKEN_SECRET,{
                expiresIn: Date.now() + process.env.JWT_REFRESH_EXPIRATION
            });

            await userModel.update({refresh_token: refreshToken},{
                where:{
                    id_user: user.id_user
                }
            });

            res.cookie('refreshToken', refreshToken,{
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.json({ accessToken });
        }else{
            res.status(401).json({
                'message': 'Wrong password'
            })
        }     
    }catch (error){
        res.status(404).json({
            'message': 'Email does not exist'
        })
        console.log(error)
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


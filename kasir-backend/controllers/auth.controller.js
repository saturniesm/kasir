const userModel = require("../models/index").user;
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

exports.register = async (request, response) => {
    const { nama_user, username, email, password, confPassword } = request.body;
    const role = "undefine";

}

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


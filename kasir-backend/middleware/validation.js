const { Op } = require("sequelize");

exports.checkDuplicates = (models, fields) => async (req, res, next) => {
  try {
    const values = fields.map(field => req.body[field]);

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      const field = fields[i];
      
      const duplicate = await model.findOne({
        where: {
          [field]: {
            [Op.eq]: values[i]
          }
        }
      });

      if (duplicate) {
        return res.status(400).json({
          message: `${field} already exists`
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};


exports.validatePassword = (req, res, next) => {
    const { password, confPassword } = req.body;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Your password is weak. Use at least 8 combination of characters" });
    }
  
    if (password !== confPassword) {
      return res.status(400).json({ message: "Password and confirmation password do not match." });
    }
    next();
};


exports.validateRequiredFields = (req, res, next) => {
    const missingFields = [];
  
    for (const field of req.requiredFields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }
  
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }
  
    next();
};


exports.validateEmail = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const email = req.body.email;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email address",
    });
  }

  next();
};




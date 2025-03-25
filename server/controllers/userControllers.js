const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class UserControllers {
  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw { name: "BadRequest", message: "Email is required" };
      }
      if (!password) {
        throw { name: "BadRequest", message: "Password is required" };
      }
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        throw { name: "Unauthorized", message: "Invalid email or password" };
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw { name: "Unauthorized", message: "Invalid email or password" };
      }
      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token, role: user.role });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserControllers;

const bcrypt = require("bcrypt");
const Validator = require("../validators");
const LoginValidator = require("../validators/login");
const RegisterValidator = require("../validators/register");

class AuthController {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async login(req, res, next) {
    try {
      const validator = new Validator(new LoginValidator());
      const validated = validator.validate(req.body);

      const existingUser = await this.userModel.findOne({
        where: {
          email: validated.email,
        },
      });

      if (!existingUser) {
        throw new Error("invalid username/password");
      }

      if (bcrypt.compareSync(validated.password, existingUser.password)) {
        req.session.regenerate(() => {
          req.session.user = existingUser;
          res.redirect("/");
        });
      } else {
        throw new Error("invalid username/password");
      }
    } catch (error) {
      req.session.error = error.message;
      res.redirect("/login");
    }
  }

  async register(req, res, next) {
    try {
      const validator = new Validator(new RegisterValidator());
      const validated = validator.validate(req.body);

      const existingUser = await this.userModel.findOne({
        where: {
          email: validated.email,
        },
      });

      if (existingUser) {
        throw new Error("user already exist");
      }

      await this.userModel.create({
        name: validated.email,
        email: validated.email,
        password: bcrypt.hashSync(validated.password, 10),
      });

      req.session.success = "Register success!";
      res.redirect("/login");
    } catch (error) {
      req.session.error = error.message;
      res.redirect("/register");
    }
  }

  async logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
}

module.exports = AuthController;

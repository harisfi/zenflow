const bcrypt = require("bcrypt");
const Validator = require("../validators");
const CreateUserValidator = require("../validators/createUser");
const UpdateUserValidator = require("../validators/updateUser");

class UserController {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async index(req, res) {
    try {
      // const users = await this.userModel.findAll();

      // res.json({
      //   success: true,
      //   data: users,
      // });
      res.render("users");
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }

  async details(req, res) {
    try {
      const id = req.params.userId;
      const user = await this.userModel.findOne({
        where: { id },
      });

      if (!user) {
        throw new Error("user not found");
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }

  async store(req, res) {
    try {
      const validator = new Validator(new CreateUserValidator());
      const validated = validator.validate(req.body);

      const user = await this.userModel.create({
        ...validated,
        password: bcrypt.hashSync(validated.password, 10),
      });

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.userId;
      const user = await this.userModel.findOne({
        where: { id },
      });

      if (!user) {
        throw new Error("user not found");
      }

      const validator = new Validator(new UpdateUserValidator());
      const validated = validator.validate(req.body);

      if (validated.password) {
        validated.password = bcrypt.hashSync(validated.password, 10);
      }

      await user.update(validated);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.userId;
      const user = await this.userModel.findOne({
        where: { id },
      });

      if (!user) {
        throw new Error("user not found");
      }

      await user.destroy();

      res.json({
        success: true,
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = UserController;

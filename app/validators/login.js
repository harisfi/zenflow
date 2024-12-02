const { object, string } = require("yup");

class LoginValidator {
  validate(input) {
    const schema = object({
      email: string().email().required(),
      password: string().required(),
    });
    return schema.validateSync(input);
  }
}

module.exports = LoginValidator;

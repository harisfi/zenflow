const { object, string } = require("yup");

class RegisterValidator {
  validate(input) {
    const schema = object({
      email: string().email().required(),
      password: string().required(),
    });
    return schema.validateSync(input);
  }
}

module.exports = RegisterValidator;

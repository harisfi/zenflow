const { object, string } = require("yup");

class CreateUserValidator {
  validate(input) {
    const schema = object({
      name: string().required(),
      email: string().email().required(),
      phone: string().nullable(),
      position: string().nullable(),
      tags: string().nullable(),
      password: string().required(),
    });
    return schema.validateSync(input);
  }
}

module.exports = CreateUserValidator;

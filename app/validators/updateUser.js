const { object, string } = require("yup");

class UpdateUserValidator {
  validate(input) {
    const schema = object({
      name: string().required(),
      email: string().email().required(),
      phone: string().nullable(),
      position: string().nullable(),
      tags: string().nullable(),
      password: string().nullable(),
    });
    return schema.validateSync(input);
  }
}

module.exports = UpdateUserValidator;

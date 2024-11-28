const { object, string, array, number } = require("yup");

class CreateProjectValidator {
  validate(input) {
    const schema = object({
      name: string().required(),
      details: string().required(),
      status: string().required(),
      user_ids: array(number()),
    });
    return schema.validateSync(input);
  }
}

module.exports = CreateProjectValidator;

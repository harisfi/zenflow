const { object, string, array, number } = require("yup");

class UpdateProjectValidator {
  validate(input) {
    const schema = object({
      name: string().required(),
      details: string().required(),
      status: string().oneOf(["PENDING", "PROGRESS", "COMPLETED"]).required(),
      user_ids: array(number()),
    });
    return schema.validateSync(input);
  }
}

module.exports = UpdateProjectValidator;

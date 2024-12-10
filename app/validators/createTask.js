const { object, string, array, number, date, boolean } = require("yup");

class CreateTaskValidator {
  validate(input) {
    const schema = object({
      code: string().required(),
      name: string().required(),
      description: string().nullable(),
      due_date: date().nullable(),
      category: string()
        .oneOf(["DESIGN", "DEVELOPMENT", "MAINTENANCE"])
        .required(),
      stage: string()
        .oneOf(["BACKLOG", "WAITING", "DOING", "REVIEW", "DONE"])
        .required(),
      project_id: number().required(),
      user_ids: array(number()),
    });
    return schema.validateSync(input);
  }
}

module.exports = CreateTaskValidator;

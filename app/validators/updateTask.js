const { object, string, array, number, date, boolean } = require("yup");

class UpdateTaskValidator {
  validate(input) {
    const schema = object({
      code: string().nullable(),
      name: string().nullable(),
      description: string().nullable(),
      due_date: date().nullable(),
      category: string()
        .oneOf(["DESIGN", "DEVELOPMENT", "MAINTENANCE"])
        .nullable(),
      stage: string()
        .oneOf(["BACKLOG", "WAITING", "DOING", "REVIEW", "DONE"])
        .nullable(),
      project_id: number().nullable(),
      user_ids: array(number()).nullable(),
    });
    return schema.validateSync(input);
  }
}

module.exports = UpdateTaskValidator;

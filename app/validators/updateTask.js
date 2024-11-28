const { object, string, array, number, date, boolean } = require("yup");

class UpdateTaskValidator {
  validate(input) {
    const schema = object({
      name: string().required(),
      description: string().nullable(),
      due_date: date().nullable(),
      category: string().nullable(),
      progress: number().nullable(),
      sub_tasks: array(
        object({
          name: string().required(),
          is_completed: boolean().required(),
          sequence: number().required(),
        })
      ).nullable(),
      stage: string()
        .oneOf(["BACKLOG", "WAITING", "DOING", "REVIEW", "DONE"])
        .required(),
      project_id: number().required(),
      user_ids: array(number()),
    });
    return schema.validateSync(input);
  }
}

module.exports = UpdateTaskValidator;

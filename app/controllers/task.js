const Validator = require("../validators");
const CreateTaskValidator = require("../validators/createTask");
const UpdateTaskValidator = require("../validators/updateTask");

class TaskController {
  constructor(taskModel, projectModel, userModel) {
    this.taskModel = taskModel;
    this.projectModel = projectModel;
    this.userModel = userModel;
  }

  async index(req, res) {
    try {
      // let tasks = await this.taskModel.findAll({
      //   include: this.userModel,
      // });

      // tasks = JSON.parse(JSON.stringify(tasks));

      // res.json({
      //   success: true,
      //   data: tasks.map((e) => ({ ...e, sub_tasks: JSON.parse(e.sub_tasks) })),
      // });
      res.render("tasks");
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }

  async details(req, res) {
    try {
      const id = req.params.taskId;
      let task = await this.taskModel.findOne({
        where: { id },
        include: this.userModel,
      });

      if (!task) {
        throw new Error("task not found");
      }

      task = JSON.parse(JSON.stringify(task));

      res.json({
        success: true,
        data: { ...task, sub_tasks: JSON.parse(task.sub_tasks) },
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
      const validator = new Validator(new CreateTaskValidator());
      const validated = validator.validate(req.body);

      const project = await this.projectModel.findOne({
        where: {
          id: validated.project_id,
        },
        include: this.userModel,
      });

      if (!project) {
        throw new Error("project not found");
      }

      const projectUserIds = project.Users.map((e) => e.id);
      let users = [];

      if (validated.user_ids.length) {
        users = await this.userModel.findAll({
          where: {
            id: validated.user_ids,
          },
        });

        if (validated.user_ids.length != users.length)
          throw new Error("user not found");

        for (const user of users) {
          let valid = false;
          for (const id of projectUserIds) {
            if (user.id == id) {
              valid = true;
            }
          }
          if (!valid) {
            throw new Error(`user ${user.id} is not in project`);
          }
        }
      }

      const task = await this.taskModel.create({
        name: validated.name,
        description: validated.description,
        due_date: validated.due_date,
        category: validated.category,
        progress: validated.progress,
        sub_tasks: validated.sub_tasks,
        stage: validated.stage,
        ProjectId: validated.project_id,
      });

      await task.setUsers(users);

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.taskId;
      const task = await this.taskModel.findOne({
        where: { id },
      });

      if (!task) {
        throw new Error("task not found");
      }

      const validator = new Validator(new UpdateTaskValidator());
      const validated = validator.validate(req.body);

      const project = await this.projectModel.findOne({
        where: {
          id: validated.project_id,
        },
        include: this.userModel,
      });

      if (!project) {
        throw new Error("project not found");
      }

      const projectUserIds = project.Users.map((e) => e.id);
      let users = [];

      if (validated.user_ids.length) {
        users = await this.userModel.findAll({
          where: {
            id: validated.user_ids,
          },
        });

        if (validated.user_ids.length != users.length)
          throw new Error("user not found");

        for (const user of users) {
          let valid = false;
          for (const id of projectUserIds) {
            if (user.id == id) {
              valid = true;
            }
          }
          if (!valid) {
            throw new Error(`user ${user.id} is not in project`);
          }
        }
      }

      await task.update({
        name: validated.name,
        description: validated.description,
        due_date: validated.due_date,
        category: validated.category,
        progress: validated.progress,
        sub_tasks: validated.sub_tasks,
        stage: validated.stage,
        ProjectId: validated.project_id,
      });

      await task.setUsers(users);

      res.json({
        success: true,
        data: task,
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
      const id = req.params.taskId;
      const task = await this.taskModel.findOne({
        where: { id },
      });

      if (!task) {
        throw new Error("task not found");
      }

      await task.destroy();

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

module.exports = TaskController;

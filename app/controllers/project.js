const dayjs = require('dayjs');
const Validator = require("../validators");
const CreateProjectValidator = require("../validators/createProject");
const UpdateProjectValidator = require("../validators/updateProject");

class ProjectController {
  constructor(projectModel, userModel) {
    this.projectModel = projectModel;
    this.userModel = userModel;
  }

  async index(req, res) {
    try {
      const projects = await this.projectModel.findAll({
        include: this.userModel,
      });
      const users = await this.userModel.findAll();

      res.render("projects", { projects, users, dayjs });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }

  async details(req, res) {
    try {
      const id = req.params.projectId;
      const project = await this.projectModel.findOne({
        where: { id },
        include: this.userModel,
      });

      if (!project) {
        throw new Error("project not found");
      }

      res.json({
        success: true,
        data: project,
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
      const validator = new Validator(new CreateProjectValidator());
      const validated = validator.validate(req.body);

      let users = [];
      if (validated.user_ids.length) {
        users = await this.userModel.findAll({
          where: {
            id: validated.user_ids,
          },
        });

        if (validated.user_ids.length != users.length)
          throw new Error("user not found");
      }

      const project = await this.projectModel.create({
        name: validated.name,
        details: validated.details,
        status: validated.status,
      });

      await project.setUsers(users);

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.projectId;
      const project = await this.projectModel.findOne({
        where: { id },
      });

      if (!project) {
        throw new Error("project not found");
      }

      const validator = new Validator(new UpdateProjectValidator());
      const validated = validator.validate(req.body);

      let users = [];
      if (validated.user_ids.length) {
        users = await this.userModel.findAll({
          where: {
            id: validated.user_ids,
          },
        });

        if (validated.user_ids.length != users.length)
          throw new Error("user not found");
      }

      await project.update({
        name: validated.name,
        details: validated.details,
        status: validated.status,
      });

      await project.setUsers(users);

      res.json({
        success: true,
        data: project,
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
      const id = req.params.projectId;
      const project = await this.projectModel.findOne({
        where: { id },
      });

      if (!project) {
        throw new Error("project not found");
      }

      await project.destroy();

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

module.exports = ProjectController;

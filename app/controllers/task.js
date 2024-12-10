const { where } = require("sequelize");
const Validator = require("../validators");
const CreateTaskValidator = require("../validators/createTask");
const UpdateTaskValidator = require("../validators/updateTask");
const dayjs = require("dayjs");

class TaskController {
  constructor(taskModel, projectModel, userModel) {
    this.taskModel = taskModel;
    this.projectModel = projectModel;
    this.userModel = userModel;
  }

  async index(req, res) {
    try {
      const projectId = req.params.projectId;
  
      const project = await this.projectModel.findOne({
        where: { id: projectId },
        attributes: ['name'],
      });
  
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }
  
      const projectName = project.name;
  
      const predefinedStages = ["BACKLOG", "WAITING", "DOING", "REVIEW", "DONE"];
  
      let tasks = await this.taskModel.findAll({
        where: { projectId },
        include: this.userModel, 
      });
  
      tasks = JSON.parse(JSON.stringify(tasks));
  
      const groupedTasks = predefinedStages.reduce((acc, stage) => {
        acc[stage] = [];
        return acc;
      }, {});
  
      tasks.forEach(task => {
        if (groupedTasks[task.stage]) {
          groupedTasks[task.stage].push(task);
        } else {
          if (!groupedTasks['UNASSIGNED']) {
            groupedTasks['UNASSIGNED'] = [];
          }
          groupedTasks['UNASSIGNED'].push(task);
        }
      });

      const connectedUser = await this.projectModel.findOne({
        where: { id: projectId },
        include: this.userModel,
      });
      
      let userIds = [];
  
      if (connectedUser && connectedUser.Users) {
        userIds = connectedUser.Users.map((user) => user.id); 
      };

      const allUser = await this.userModel.findAll({
        where: {
          id: userIds, 
        },
      });
  
      res.render("tasks", {
        currentUser: req.session.user, 
        groupedTasks,                 
        projectName,                  
        predefinedStages,             
        dayjs,
        allUser,
        projectId
      });

    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      res.status(500).json({
        success: false,
        message: "An internal server error occurred",
      });
    }
  }
    
  async details(req, res) {
    try {
      const id = req.params.taskId;
      const task = await this.taskModel.findOne({
        where: { id },
        include: this.userModel,
      });

      if (!task) {
        throw new Error("user not found");
      };

      const connectedUser = await this.projectModel.findOne({
        where: { id: task.ProjectId },
        include: this.userModel,
      });
      
      let userIds = [];
  
      if (connectedUser && connectedUser.Users) {
        userIds = connectedUser.Users.map((user) => user.id); 
      };

      const allUsers = await this.userModel.findAll({
        where: {
          id: userIds, 
        },
      });

      res.json({
        success: true,
        data: task,
        allUsers
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
        code: validated.code,
        name: validated.name,
        description: validated.description,
        due_date: validated.due_date,
        category: validated.category,
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

      const task = await this.taskModel.findOne({ where: { id } });
      if (!task) {
        throw new Error("Task not found");
      }
  
      const validator = new Validator(new UpdateTaskValidator());
      const validated = validator.validate(req.body);
  
      const projectId = validated.project_id ?? task.ProjectId;
      const project = await this.projectModel.findOne({
        where: { id: projectId },
        include: this.userModel,
      });
      if (!project) {
        throw new Error("Project not found");
      }
  
      const projectUserIds = project.Users.map((e) => e.id);
      
      let users = [];
      if (validated.user_ids?.length) {
        users = await this.userModel.findAll({ where: { id: validated.user_ids } });
  
        if (validated.user_ids.length !== users.length) {
          throw new Error("One or more users not found");
        }
  
        for (const user of users) {
          if (!projectUserIds.includes(user.id)) {
            throw new Error(`User ${user.id} is not part of the project`);
          }
        }
      }
  
      const updatedData = {
        code: validated.code ?? task.code,
        name: validated.name ?? task.name,
        description: validated.description ?? task.description,
        due_date: validated.due_date ?? task.due_date,
        category: validated.category ?? task.category,
        stage: validated.stage ?? task.stage,
      };
  
      await task.update(updatedData);
  
      if (users.length) {
        await task.setUsers(users);
      } else {
        await task.setUsers(null);
      }
  
      res.json({ success: true, data: task });
    } catch (error) {
      console.error(error); // Log error for debugging
      res.status(400).json({ success: false, message: error.message });
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

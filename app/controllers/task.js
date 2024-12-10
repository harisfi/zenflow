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
  
      // Fetch the project details
      const project = await this.projectModel.findOne({
        where: { id: projectId },
        attributes: ['name'],
      });
  
      // If project is not found
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }
  
      const projectName = project.name;
  
      // Predefined list of stages
      const predefinedStages = ["BACKLOG", "WAITING", "DOING", "REVIEW", "DONE"];
  
      // Fetch all tasks for the project
      let tasks = await this.taskModel.findAll({
        where: { projectId },
        include: this.userModel, 
      });
  
      // Convert tasks to plain JavaScript objects
      tasks = JSON.parse(JSON.stringify(tasks));
  
      // Initialize groupedTasks with empty arrays for each stage
      const groupedTasks = predefinedStages.reduce((acc, stage) => {
        acc[stage] = [];
        return acc;
      }, {});
  
      // Group tasks by their stage
      tasks.forEach(task => {
        if (groupedTasks[task.stage]) {
          groupedTasks[task.stage].push(task);
        } else {
          // Handle tasks with an undefined or unexpected stage
          if (!groupedTasks['UNASSIGNED']) {
            groupedTasks['UNASSIGNED'] = [];
          }
          groupedTasks['UNASSIGNED'].push(task);
        }
      });

      const allUser = await this.userModel.findAll({
        attributes: ['id', 'name']
      });
  
      // Render the view with the grouped tasks and project details
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
      }

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

      console.log(id);
  
      // Step 1: Find the task
      const task = await this.taskModel.findOne({ where: { id } });
      if (!task) {
        throw new Error("Task not found");
      }
  
      // Step 2: Validate input
      const validator = new Validator(new UpdateTaskValidator());
      const validated = validator.validate(req.body);
  
      // Step 3: Find the associated project
      const projectId = validated.project_id ?? task.ProjectId;
      const project = await this.projectModel.findOne({
        where: { id: projectId },
        include: this.userModel,
      });
      if (!project) {
        throw new Error("Project not found");
      }
  
      // Step 4: Validate user IDs against project users
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
  
      // Step 5: Merge validated fields with existing task data
      const updatedData = {
        name: validated.name ?? task.name,
        description: validated.description ?? task.description,
        due_date: validated.due_date ?? task.due_date,
        category: validated.category ?? task.category,
        progress: validated.progress ?? task.progress,
        sub_tasks: validated.sub_tasks ?? task.sub_tasks,
        stage: validated.stage ?? task.stage,
        ProjectId: projectId,
      };
  
      // Step 6: Update the task
      await task.update(updatedData);
  
      // Step 7: Update associated users if provided
      if (users.length) {
        await task.setUsers(users);
      }
  
      // Step 8: Send a response
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

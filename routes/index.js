var express = require("express");
const UserController = require("../app/controllers/user");
const ProjectController = require("../app/controllers/project");
const TaskController = require("../app/controllers/task");

class Routes {
  constructor(userModel, projectModel, taskModel) {
    const router = express.Router();

    const userController = new UserController(userModel);
    const projectController = new ProjectController(projectModel, userModel);
    const taskController = new TaskController(
      taskModel,
      projectModel,
      userModel
    );

    router.get("/", function (req, res, next) {
      res.send("Hello world!");
    });

    router
      .route("/users")
      .get(userController.index.bind(userController))
      .post(userController.store.bind(userController));

    router
      .route("/users/:userId")
      .get(userController.details.bind(userController))
      .put(userController.update.bind(userController))
      .delete(userController.delete.bind(userController));

    router
      .route("/projects")
      .get(projectController.index.bind(projectController))
      .post(projectController.store.bind(projectController));

    router
      .route("/projects/:projectId")
      .get(projectController.details.bind(projectController))
      .put(projectController.update.bind(projectController))
      .delete(projectController.delete.bind(projectController));

    router
      .route("/tasks")
      .get(taskController.index.bind(taskController))
      .post(taskController.store.bind(taskController));

    router
      .route("/tasks/:taskId")
      .get(taskController.details.bind(taskController))
      .put(taskController.update.bind(taskController))
      .delete(taskController.delete.bind(taskController));

    return router;
  }
}

module.exports = Routes;

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

    router.get("/login", function (req, res, next) {
      res.render("auth/login");
    });

    router.get("/register", function (req, res, next) {
      res.render("auth/register");
    });

    router
      .route("/")
      .get(projectController.index.bind(projectController))
      .post(projectController.store.bind(projectController));

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
      .route("/:projectId")
      .get(projectController.details.bind(projectController))
      .put(projectController.update.bind(projectController))
      .delete(projectController.delete.bind(projectController));

    router
      .route("/:projectId/tasks")
      .get(taskController.index.bind(taskController))
      .post(taskController.store.bind(taskController));

    router
      .route("/:projectId/tasks/:taskId")
      .get(taskController.details.bind(taskController))
      .put(taskController.update.bind(taskController))
      .delete(taskController.delete.bind(taskController));

    return router;
  }
}

module.exports = Routes;

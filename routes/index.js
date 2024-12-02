var express = require("express");
const UserController = require("../app/controllers/user");
const ProjectController = require("../app/controllers/project");
const TaskController = require("../app/controllers/task");
const AuthController = require("../app/controllers/auth");
const AuthMiddleware = require("../app/middlewares/auth");

class Routes {
  constructor(userModel, projectModel, taskModel) {
    const router = express.Router();

    const authMiddleware = new AuthMiddleware();

    const authController = new AuthController(userModel);
    const userController = new UserController(userModel);
    const projectController = new ProjectController(projectModel, userModel);
    const taskController = new TaskController(
      taskModel,
      projectModel,
      userModel
    );

    router
      .route("/login")
      .get(authMiddleware.handle.bind(authMiddleware), (_, res) =>
        res.render("auth/login")
      )
      .post(
        authMiddleware.handle.bind(authMiddleware),
        authController.login.bind(authController)
      );

    router
      .route("/register")
      .get(authMiddleware.handle.bind(authMiddleware), (_, res) =>
        res.render("auth/register")
      )
      .post(
        authMiddleware.handle.bind(authMiddleware),
        authController.register.bind(authController)
      );

    router.get(
      "/logout",
      authMiddleware.handle.bind(authMiddleware),
      authController.logout.bind(authController)
    );

    router
      .route("/")
      .get(
        authMiddleware.handle.bind(authMiddleware),
        projectController.index.bind(projectController)
      )
      .post(
        authMiddleware.handle.bind(authMiddleware),
        projectController.store.bind(projectController)
      );

    router
      .route("/users")
      .get(
        authMiddleware.handle.bind(authMiddleware),
        userController.index.bind(userController)
      )
      .post(
        authMiddleware.handle.bind(authMiddleware),
        userController.store.bind(userController)
      );

    router
      .route("/users/:userId")
      .get(
        authMiddleware.handle.bind(authMiddleware),
        userController.details.bind(userController)
      )
      .put(
        authMiddleware.handle.bind(authMiddleware),
        userController.update.bind(userController)
      )
      .delete(
        authMiddleware.handle.bind(authMiddleware),
        userController.delete.bind(userController)
      );

    router
      .route("/:projectId")
      .get(
        authMiddleware.handle.bind(authMiddleware),
        projectController.details.bind(projectController)
      )
      .put(
        authMiddleware.handle.bind(authMiddleware),
        projectController.update.bind(projectController)
      )
      .delete(
        authMiddleware.handle.bind(authMiddleware),
        projectController.delete.bind(projectController)
      );

    router
      .route("/:projectId/tasks")
      .get(
        authMiddleware.handle.bind(authMiddleware),
        taskController.index.bind(taskController)
      )
      .post(
        authMiddleware.handle.bind(authMiddleware),
        taskController.store.bind(taskController)
      );

    router
      .route("/:projectId/tasks/:taskId")
      .get(
        authMiddleware.handle.bind(authMiddleware),
        taskController.details.bind(taskController)
      )
      .put(
        authMiddleware.handle.bind(authMiddleware),
        taskController.update.bind(taskController)
      )
      .delete(
        authMiddleware.handle.bind(authMiddleware),
        taskController.delete.bind(taskController)
      );

    return router;
  }
}

module.exports = Routes;

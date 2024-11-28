var express = require("express");
const UserController = require("../app/controllers/user");
const ProjectController = require("../app/controllers/project");

class Routes {
  constructor(sequelize) {
    const router = express.Router();

    const userController = new UserController(sequelize);
    const projectController = new ProjectController(sequelize);

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

    return router;
  }
}

module.exports = Routes;

var express = require("express");
const UserController = require("../app/controllers/user");

class Routes {
  constructor(sequelize) {
    const router = express.Router();

    const userController = new UserController(sequelize);

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

    return router;
  }
}

module.exports = Routes;

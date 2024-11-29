const Project = require("./project");
const Task = require("./task");
const User = require("./user");

class Model {
  constructor(sequelize) {
    const projectModel = new Project(sequelize);
    const taskModel = new Task(sequelize);
    const userModel = new User(sequelize);

    projectModel.belongsToMany(userModel, {
      through: "ProjectUsers",
    });
    userModel.belongsToMany(projectModel, {
      through: "ProjectUsers",
    });

    taskModel.belongsToMany(userModel, {
      through: "TaskUsers",
    });
    userModel.belongsToMany(taskModel, {
      through: "TaskUsers",
    });

    projectModel.hasMany(taskModel);
    taskModel.belongsTo(projectModel);

    return [userModel, projectModel, taskModel];
  }
}

module.exports = Model;

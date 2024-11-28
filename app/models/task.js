"use strict";

const { DataTypes } = require("sequelize");

class Task {
  constructor(sequelize) {
    const model = sequelize.define("Task", {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      due_date: DataTypes.DATE,
      category: DataTypes.STRING,
      progress: DataTypes.INTEGER,
      sub_tasks: DataTypes.JSON,
      stage: DataTypes.ENUM("BACKLOG", "WAITING", "DOING", "REVIEW", "DONE"),
      ProjectId: DataTypes.INTEGER,
    });

    return model;
  }

  async sync(sequelize) {
    await sequelize.sync();
  }
}

module.exports = Task;

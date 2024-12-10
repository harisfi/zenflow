"use strict";

const { DataTypes } = require("sequelize");

class Task {
  constructor(sequelize) {
    const model = sequelize.define("Task", {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      due_date: DataTypes.DATE,
      category: DataTypes.ENUM("DESIGN", "DEVELOPMENT", "MAINTENANCE"),
      stage: DataTypes.ENUM("BACKLOG", "WAITING", "DOING", "REVIEW", "DONE"),
      projectId: DataTypes.INTEGER,
    });

    return model;
  }

  async sync(sequelize) {
    await sequelize.sync();
  }
}

module.exports = Task;

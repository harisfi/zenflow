"use strict";

const { DataTypes } = require("sequelize");

class Project {
  constructor(sequelize) {
    const model = sequelize.define("Project", {
      name: DataTypes.STRING,
      details: DataTypes.STRING,
      status: DataTypes.STRING,
    });

    return model;
  }

  async sync(sequelize) {
    await sequelize.sync();
  }
}

module.exports = Project;

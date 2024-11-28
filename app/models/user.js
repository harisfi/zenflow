"use strict";

const { DataTypes } = require("sequelize");

class User {
  constructor(sequelize) {
    const model = sequelize.define("User", {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      position: DataTypes.STRING,
      tags: DataTypes.STRING,
      password: DataTypes.STRING,
    });

    return model;
  }

  async sync(sequelize) {
    await sequelize.sync();
  }
}

module.exports = User;

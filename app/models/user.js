"use strict";

const { DataTypes } = require("sequelize");

class User {
  constructor(sequelize) {
    const user = sequelize.define("User", {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      position: DataTypes.STRING,
      tags: DataTypes.STRING,
      password: DataTypes.STRING,
    });

    this.sync(sequelize);

    return user;
  }

  async sync(sequelize) {
    await sequelize.sync();
  }
}

module.exports = User;

"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        name: "Jansh Wells",
        email: "jansh@example.com",
        phone: "+628123456789",
        position: "Web Designer",
        tags: "Laravel,React",
        password: bcrypt.hashSync("password", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Denny Silva",
        email: "denny@example.com",
        phone: "+628123456789",
        position: "Web Developer",
        tags: "Laravel,Django",
        password: bcrypt.hashSync("password", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};

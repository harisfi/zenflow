"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      due_date: {
        type: Sequelize.DATE,
      },
      category: {
        type: Sequelize.STRING,
      },
      progress: {
        type: Sequelize.INTEGER,
      },
      sub_tasks: {
        type: Sequelize.JSON,
      },
      stage: {
        allowNull: false,
        type: Sequelize.ENUM("BACKLOG", "WAITING", "DOING", "REVIEW", "DONE"),
      },
      ProjectId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Projects",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tasks");
  },
};
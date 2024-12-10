'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tasks', [
      {
        code: 'DEV010203',
        name: 'Task 1',
        description: 'This is the first task detail.',
        due_date: new Date('2024-12-31'),
        category: 'DESIGN',
        stage: 'BACKLOG',
        ProjectId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'DEV020304',
        name: 'Task 2',
        description: 'This is the second task detail.',
        due_date: new Date('2024-11-30'),
        category: 'DEVELOPMENT',
        stage: 'BACKLOG',
        ProjectId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'DEV030405',
        name: 'Task 3',
        description: 'This is the third task detail.',
        due_date: new Date('2024-11-30'),
        category: 'MAINTENANCE',
        stage: 'BACKLOG',
        ProjectId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Viewed', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userID: {
        type: Sequelize.INTEGER
      },
      movieID: {
        type: Sequelize.INTEGER
      },
      view: {
        type: Sequelize.INTEGER, 
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Viewed');
  }
};
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Movies", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      overview: {
        type: Sequelize.TEXT,
      },
      poster_path: {
        type: Sequelize.STRING,
      },
      release_date: {
        type: Sequelize.DATEONLY,
      },
      rating: {
        type: Sequelize.FLOAT,
      },
      link: {
        type: Sequelize.STRING,
      },
      Action: {
        type: Sequelize.BOOLEAN,
      },
      Adventure: {
        type: Sequelize.BOOLEAN,
      },
      Animation: {
        type: Sequelize.BOOLEAN
      },
      Comedy: {
        type: Sequelize.BOOLEAN,
      },
      Crime: {
        type: Sequelize.BOOLEAN
      },
      Documentary: {
        type: Sequelize.BOOLEAN,
      },
      Drama: {
        type: Sequelize.BOOLEAN
      },
      Family: {
        type: Sequelize.BOOLEAN,
      },
      Fantasy: {
        type: Sequelize.BOOLEAN
      },
      History: {
        type: Sequelize.BOOLEAN,
      },
      Horror: {
        type: Sequelize.BOOLEAN
      },
      Music: {
        type: Sequelize.BOOLEAN,
      },
      Mystery: {
        type: Sequelize.BOOLEAN
      },
      Romance: {
        type: Sequelize.BOOLEAN,
      },
      "Science Fiction": {
        type: Sequelize.BOOLEAN
      },
      "TV Movie": {
        type: Sequelize.BOOLEAN,
      },
      Thriller: {
        type: Sequelize.BOOLEAN
      },
      War: {
        type: Sequelize.BOOLEAN,
      },
      Western: {
        type: Sequelize.BOOLEAN
      },
      cast: {
        type: Sequelize.TEXT,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("movies");
  },
};

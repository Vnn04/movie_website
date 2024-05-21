'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Movie.init({
    title: DataTypes.STRING,
    overview: DataTypes.TEXT,
    poster_path: DataTypes.STRING,
    release_date: DataTypes.DATEONLY,
    rating: DataTypes.FLOAT,
    link: DataTypes.STRING,
    Action: DataTypes.BOOLEAN,
    Adventure: DataTypes.BOOLEAN,
    Animation: DataTypes.BOOLEAN,
    Comedy: DataTypes.BOOLEAN,
    Crime: DataTypes.BOOLEAN,
    Documentary: DataTypes.BOOLEAN,
    Drama: DataTypes.BOOLEAN,
    Family: DataTypes.BOOLEAN,
    Fantasy: DataTypes.BOOLEAN,
    History: DataTypes.BOOLEAN,
    Horror: DataTypes.BOOLEAN,
    Music: DataTypes.BOOLEAN,
    Mystery: DataTypes.BOOLEAN,
    Romance: DataTypes.BOOLEAN,
    "Science Fiction": DataTypes.BOOLEAN,
    "TV Movie": DataTypes.BOOLEAN,
    Thriller: DataTypes.BOOLEAN,
    War: DataTypes.BOOLEAN,
    Western: DataTypes.BOOLEAN,
    cast: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Movie',
    timestamps:false
  });
  return Movie
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Viewed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Viewed.init({
    userID: DataTypes.INTEGER,
    movieID: DataTypes.INTEGER,
    view: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Viewed',
    timestamps: false,
    freezeTableName: true

  });
  return Viewed;
};
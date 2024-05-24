'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Watch_trailer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Watch_trailer.init({
    userID: DataTypes.INTEGER,
    movieID: DataTypes.INTEGER,
    watch: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'watch_trailer',
    timestamps:false,
    freezeTableName: true
  });
  return Watch_trailer;
};
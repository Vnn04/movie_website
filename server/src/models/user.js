'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  
  User.init({
    username: DataTypes.STRING,
    fullname: DataTypes.STRING,
    date_of_birth : DataTypes.DATEONLY,
    password: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    phone: DataTypes.STRING, 
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    bought_vip: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    timestamps:false

  });
  return User;
};
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
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    token: DataTypes.STRING,
    is_expired: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  User.associate = function(models) {
    User.belongsToMany(models.Product, { through: 'Orders', foreignKey: 'userId', as: 'items'})
    User.hasOne(models.Profile, { foreignKey: 'userId', as: 'User' })
  }
  return User;
};
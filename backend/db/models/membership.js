'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.Group, { foreignKey: 'groupId' });
      Membership.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Membership.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM("co-host", "member", "pending"),
      allowNull: false,
      validate: {
        validType(value) {
          if (value !== 'co-host' && value !== "member" && value !== 'pending') {
            throw new Error("Type must be co-host, member, or pending")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MyBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MyBook.belongsTo(models.User, { foreignKey: "UserId" });
      MyBook.belongsTo(models.Book, { foreignKey: "BookId" });
    }
  }
  MyBook.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "User ID is required",
          },
          notEmpty: {
            msg: "User ID is required",
          },
        },
      },
      BookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Course ID is required",
          },
          notEmpty: {
            msg: "Course ID is required",
          },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Borrowed",
      },
    },
    {
      sequelize,
      modelName: "MyBook",
    }
  );
  return MyBook;
};

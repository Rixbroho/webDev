const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Dish = sequelize.define(
  "Dish",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM("Veg", "Non-Veg", "Dessert", "Beverage"),
      allowNull: false,
      defaultValue: "Veg",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Restaurants",
        key: "id",
      },
    },
  },
  {
    tableName: "dishes",
    timestamps: true,
  },
);

module.exports = Dish;

const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Cuisine = sequelize.define(
  "Cuisine",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "cuisines",
    timestamps: true,
  },
);

module.exports = Cuisine;

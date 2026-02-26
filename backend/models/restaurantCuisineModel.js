const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const RestaurantCuisine = sequelize.define(
  "RestaurantCuisine",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Restaurants",
        key: "id",
      },
    },
    cuisineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Cuisines",
        key: "id",
      },
    },
  },
  {
    tableName: "restaurant_cuisines",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["restaurantId", "cuisineId"],
      },
    ],
  },
);

module.exports = RestaurantCuisine;

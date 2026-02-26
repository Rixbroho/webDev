const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Restaurant = sequelize.define("Restaurant", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cuisine: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "General",
  },
  priceRange: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "$$",
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 5.0,
  },
  // Rating & Review System fields
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: "🍽️",
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  availability: {
    type: DataTypes.STRING,
    defaultValue: "Available",
  },
  // Location System
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Kathmandu",
  },
  area: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fullAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    validate: {
      min: -90,
      max: 90,
    },
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    validate: {
      min: -180,
      max: 180,
    },
  },
});

module.exports = Restaurant;

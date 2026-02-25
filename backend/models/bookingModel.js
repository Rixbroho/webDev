const { DataTypes } = require("sequelize");
// Destructure sequelize from the exported object
const { sequelize } = require("../database/db");

const Booking = sequelize.define("Booking", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  restaurantId: { type: DataTypes.INTEGER, allowNull: false },
  restaurantName: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING },
  cuisine: { type: DataTypes.STRING },
  date: { type: DataTypes.STRING, allowNull: false },
  time: { type: DataTypes.STRING, allowNull: false },
  guests: { type: DataTypes.INTEGER },
  priceRange: { type: DataTypes.STRING },
  status: {
    type: DataTypes.ENUM("Pending", "Confirmed", "Declined"),
    defaultValue: "Pending",
  },
});

// Keep old field names as aliases for backward compatibility
Booking.prototype.getVenueId = function () {
  return this.restaurantId;
};
Booking.prototype.getVenueName = function () {
  return this.restaurantName;
};
Booking.prototype.getPlayers = function () {
  return this.guests;
};

module.exports = Booking;

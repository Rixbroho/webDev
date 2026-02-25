const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Setting = sequelize.define('Setting', {
  key: { type: DataTypes.STRING, primaryKey: true },
  value: { type: DataTypes.TEXT }
});

module.exports = Setting;
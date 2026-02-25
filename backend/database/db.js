const { Sequelize } = require("sequelize");
require("dotenv").config();

// Validate required environment variables
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;

if (!dbName || !dbUser || !dbPass || !dbHost) {
  console.error("Missing required database configuration:");
  if (!dbName) console.error("  - DB_NAME is not set in .env");
  if (!dbUser) console.error("  - DB_USER is not set in .env");
  if (!dbPass) console.error("  - DB_PASS is not set in .env");
  if (!dbHost) console.error("  - DB_HOST is not set in .env");
  process.exit(1);
}

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: "postgres",
  logging: false,
  port: process.env.DB_PORT || 5432,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

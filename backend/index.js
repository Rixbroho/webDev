require("dotenv").config();
const express = require("express");
const { sequelize, connectDB } = require("./database/db");
const path = require("path");
const app = express();
const port = 3000;
const bookingRoutes = require("./routes/bookingRoute");

const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.use(express.json());

// Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============== MODEL ASSOCIATIONS ==============
// Import models
const Restaurant = require("./models/venueModel");
const Cuisine = require("./models/cuisineModel");
const RestaurantCuisine = require("./models/restaurantCuisineModel");
const Dish = require("./models/dishModel");
const Review = require("./models/reviewModel");
const User = require("./models/usermodel");

// Define associations
// Restaurant - Cuisine (Many-to-Many)
Restaurant.belongsToMany(Cuisine, {
  through: RestaurantCuisine,
  foreignKey: "restaurantId",
  as: "cuisines",
});
Cuisine.belongsToMany(Restaurant, {
  through: RestaurantCuisine,
  foreignKey: "cuisineId",
});

// Restaurant - Dish (One-to-Many)
Restaurant.hasMany(Dish, { foreignKey: "restaurantId", as: "dishes" });
Dish.belongsTo(Restaurant, { foreignKey: "restaurantId" });

// Review - User (Many-to-One)
Review.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Review, { foreignKey: "userId", as: "reviews" });

// Review - Restaurant (Many-to-One)
Review.belongsTo(Restaurant, { foreignKey: "restaurantId", as: "restaurant" });
Restaurant.hasMany(Review, { foreignKey: "restaurantId", as: "reviews" });
// =================================================

app.use("/api/user/", require("./routes/route"));
app.use("/api", require("./routes/venueRoute"));
app.use("/api", bookingRoutes);
// Admin settings routes
app.use("/api/admin", require("./routes/settingsRoute"));

// Cuisine routes
app.use("/api/cuisine", require("./routes/cuisineRoute"));

// Dish routes
app.use("/api/dishes", require("./routes/dishRoute"));

// Restaurant-Cuisine association routes
const restaurantCuisineRoutes = require("./routes/restaurantCuisineRoute");
app.use("/api/restaurant", restaurantCuisineRoutes);

// Review routes
app.use("/api/reviews", require("./routes/reviewRoute"));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the TurfTime API",
  });
});

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });

  // Development convenience: auto-create an admin if none exists
  if (process.env.NODE_ENV !== "production") {
    try {
      const bcrypt = require("bcrypt");
      const adminEmail = process.env.ADMIN_EMAIL || "admin@local.test";
      const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
      const adminName = process.env.ADMIN_NAME || "Administrator";

      const existingAdmin = await User.findOne({ where: { role: "admin" } });
      if (!existingAdmin) {
        const hashed = await bcrypt.hash(adminPassword, 10);
        await User.create({
          username: adminName,
          email: adminEmail,
          password: hashed,
          role: "admin",
        });
        console.log(
          `Created admin user: ${adminEmail} (password: ${adminPassword})`,
        );
      } else {
        console.log(`Admin user exists: ${existingAdmin.email}`);
      }
    } catch (err) {
      console.warn("Admin seeding failed:", err.message || err);
    }
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();

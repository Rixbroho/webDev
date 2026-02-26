const express = require("express");
const router = express.Router();
const {
  createCuisine,
  getAllCuisines,
  getCuisineById,
  updateCuisine,
  deleteCuisine,
  getRestaurantsByCuisine,
} = require("../controllers/cuisineController");
const authGuard = require("../helpers/authguagrd");
const isAdmin = require("../helpers/isAdmin");

// Public routes
router.get("/", getAllCuisines);
router.get("/:id", getCuisineById);
router.get("/:cuisineId/restaurants", getRestaurantsByCuisine);

// Admin routes (protected)
router.post("/", authGuard, isAdmin, createCuisine);
router.put("/:id", authGuard, isAdmin, updateCuisine);
router.delete("/:id", authGuard, isAdmin, deleteCuisine);

module.exports = router;

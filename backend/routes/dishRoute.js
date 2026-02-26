const express = require("express");
const router = express.Router();
const {
  createDish,
  getDishesByRestaurant,
  getAllDishes,
  getDishById,
  updateDish,
  deleteDish,
} = require("../controllers/dishController");
const authGuard = require("../helpers/authguagrd");
const isAdmin = require("../helpers/isAdmin");
const fileUpload = require("../helpers/multer");

// Public routes
router.get("/", getAllDishes);
router.get("/restaurant", getDishesByRestaurant);
router.get("/:id", getDishById);

// Admin routes (protected)
router.post("/", authGuard, isAdmin, fileUpload("image"), createDish);
router.put("/:id", authGuard, isAdmin, fileUpload("image"), updateDish);
router.delete("/:id", authGuard, isAdmin, deleteDish);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createRestaurant,
  getAllRestaurants,
  updateRestaurant,
  deleteRestaurant,
  getVenueById,
  createVenue,
  getAllVenues,
  updateVenue,
  deleteVenue,
} = require("../controllers/venueController");
const authGuard = require("../helpers/authguagrd");
const isAdmin = require("../helpers/isAdmin");
const fileUpload = require("../helpers/multer");

// New Restaurant routes (recommended)
router.post(
  "/restaurant",
  authGuard,
  isAdmin,
  fileUpload("image"),
  createRestaurant,
);
router.get("/restaurant", getAllRestaurants);
router.get("/restaurant/:id", getVenueById);
router.put(
  "/restaurant/:id",
  authGuard,
  isAdmin,
  fileUpload("image"),
  updateRestaurant,
);
router.delete("/restaurant/:id", authGuard, isAdmin, deleteRestaurant);

// Old Venue routes (backward compatibility)
router.post("/venue", authGuard, isAdmin, fileUpload("image"), createVenue);
router.get("/venue", getAllVenues);
router.put("/venue/:id", authGuard, isAdmin, fileUpload("image"), updateVenue);
router.delete("/venue/:id", authGuard, isAdmin, deleteVenue);

module.exports = router;

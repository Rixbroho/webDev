const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authGuard = require("../helpers/authguagrd");

// Public routes
router.get("/restaurant/:restaurantId", reviewController.getRestaurantReviews);

// Protected routes - require authentication
router.post("/", authGuard, reviewController.createReview);
router.get(
  "/user/:restaurantId",
  authGuard,
  reviewController.getUserReviewForRestaurant,
);
router.put("/:id", authGuard, reviewController.updateReview);
router.delete("/:id", authGuard, reviewController.deleteReview);

// Admin routes
router.get("/", authGuard, reviewController.getAllReviews);

module.exports = router;

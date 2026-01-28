import express from "express";
import {
  createReview,
  getReviewsByRestaurant,
  deleteReview,
} from "../controllers/reviewController.js";
import authGuard from "../helpers/authGuard.js";

const router = express.Router();

router.post("/", authGuard, createReview);
router.get("/:restaurantId", getReviewsByRestaurant);
router.delete("/:id", authGuard, deleteReview);

export default router;

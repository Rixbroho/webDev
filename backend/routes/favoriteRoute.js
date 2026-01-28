import express from "express";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
} from "../controllers/favoriteController.js";
import authGuard from "../helpers/authGuard.js";

const router = express.Router();

router.post("/:restaurantId", authGuard, addFavorite);
router.delete("/:restaurantId", authGuard, removeFavorite);
router.get("/", authGuard, getUserFavorites);

export default router;

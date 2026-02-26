const express = require("express");
const router = express.Router();
const Restaurant = require("../models/venueModel");
const Cuisine = require("../models/cuisineModel");
const RestaurantCuisine = require("../models/restaurantCuisineModel");
const authGuard = require("../helpers/authguagrd");
const isAdmin = require("../helpers/isAdmin");

// Assign cuisines to a restaurant
router.post("/:id/cuisines", authGuard, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { cuisineIds } = req.body;

    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    if (!cuisineIds || !Array.isArray(cuisineIds)) {
      return res.status(400).json({
        success: false,
        message: "Cuisine IDs array is required",
      });
    }

    // Remove existing associations
    await RestaurantCuisine.destroy({ where: { restaurantId: id } });

    // Add new associations
    const associations = cuisineIds.map((cuisineId) => ({
      restaurantId: parseInt(id),
      cuisineId: parseInt(cuisineId),
    }));

    await RestaurantCuisine.bulkCreate(associations);

    // Fetch updated cuisines
    const cuisines = await Cuisine.findAll({
      where: { id: cuisineIds },
    });

    res.status(200).json({
      success: true,
      message: "Cuisines assigned successfully",
      cuisines,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get cuisines for a restaurant
router.get("/:id/cuisines", async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    const cuisines = await Cuisine.findAll({
      include: {
        model: Restaurant,
        where: { id },
        through: { attributes: [] },
      },
    });

    res.status(200).json({
      success: true,
      cuisines,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove a cuisine from a restaurant
router.delete(
  "/:id/cuisines/:cuisineId",
  authGuard,
  isAdmin,
  async (req, res) => {
    try {
      const { id, cuisineId } = req.params;

      const restaurant = await Restaurant.findByPk(id);
      if (!restaurant) {
        return res
          .status(404)
          .json({ success: false, message: "Restaurant not found" });
      }

      await RestaurantCuisine.destroy({
        where: {
          restaurantId: id,
          cuisineId,
        },
      });

      res.status(200).json({
        success: true,
        message: "Cuisine removed from restaurant",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
);

module.exports = router;

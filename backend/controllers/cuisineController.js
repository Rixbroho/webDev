const Cuisine = require("../models/cuisineModel");
const RestaurantCuisine = require("../models/restaurantCuisineModel");
const Restaurant = require("../models/venueModel");

// Create a new cuisine
const createCuisine = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Cuisine name is required" });
    }

    // Check if cuisine already exists
    const existingCuisine = await Cuisine.findOne({ where: { name } });
    if (existingCuisine) {
      return res
        .status(400)
        .json({ success: false, message: "Cuisine already exists" });
    }

    const cuisine = await Cuisine.create({
      name,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Cuisine created successfully",
      cuisine,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all cuisines
const getAllCuisines = async (req, res) => {
  try {
    const cuisines = await Cuisine.findAll({
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      cuisines,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get cuisine by ID
const getCuisineById = async (req, res) => {
  try {
    const { id } = req.params;
    const cuisine = await Cuisine.findByPk(id);

    if (!cuisine) {
      return res
        .status(404)
        .json({ success: false, message: "Cuisine not found" });
    }

    res.status(200).json({
      success: true,
      cuisine,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update cuisine
const updateCuisine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    const cuisine = await Cuisine.findByPk(id);
    if (!cuisine) {
      return res
        .status(404)
        .json({ success: false, message: "Cuisine not found" });
    }

    // Check if new name already exists (excluding current cuisine)
    if (name && name !== cuisine.name) {
      const existingCuisine = await Cuisine.findOne({ where: { name } });
      if (existingCuisine) {
        return res
          .status(400)
          .json({ success: false, message: "Cuisine name already exists" });
      }
    }

    await cuisine.update({
      name: name || cuisine.name,
      description:
        description !== undefined ? description : cuisine.description,
      image: image !== undefined ? image : cuisine.image,
    });

    res.status(200).json({
      success: true,
      message: "Cuisine updated successfully",
      cuisine,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete cuisine
const deleteCuisine = async (req, res) => {
  try {
    const { id } = req.params;

    const cuisine = await Cuisine.findByPk(id);
    if (!cuisine) {
      return res
        .status(404)
        .json({ success: false, message: "Cuisine not found" });
    }

    // Delete associated restaurant-cuisine relationships first
    await RestaurantCuisine.destroy({ where: { cuisineId: id } });

    await cuisine.destroy();

    res.status(200).json({
      success: true,
      message: "Cuisine deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get restaurants by cuisine
const getRestaurantsByCuisine = async (req, res) => {
  try {
    const { cuisineId } = req.params;

    const cuisine = await Cuisine.findByPk(cuisineId, {
      include: {
        model: Restaurant,
        through: { attributes: [] },
      },
    });

    if (!cuisine) {
      return res
        .status(404)
        .json({ success: false, message: "Cuisine not found" });
    }

    res.status(200).json({
      success: true,
      cuisine,
      restaurants: cuisine.Restaurants || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCuisine,
  getAllCuisines,
  getCuisineById,
  updateCuisine,
  deleteCuisine,
  getRestaurantsByCuisine,
};

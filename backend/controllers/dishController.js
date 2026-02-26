const Dish = require("../models/dishModel");
const Restaurant = require("../models/venueModel");
const { Op } = require("sequelize");

// Create a new dish
const createDish = async (req, res) => {
  try {
    const { name, price, description, category, isAvailable, restaurantId } =
      req.body;

    if (!name || !price || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and restaurant ID are required",
      });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Handle image upload
    let image = null;
    if (req.files && req.files.length > 0) {
      image = `/uploads/${req.files[0].filename}`;
    }

    const dish = await Dish.create({
      name,
      price,
      description,
      category: category || "Veg",
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      image,
      restaurantId,
    });

    res.status(201).json({
      success: true,
      message: "Dish created successfully",
      dish,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dishes by restaurant
const getDishesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required",
      });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const dishes = await Dish.findAll({
      where: { restaurantId },
      order: [
        ["category", "ASC"],
        ["name", "ASC"],
      ],
    });

    res.status(200).json({
      success: true,
      dishes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all dishes with optional filtering
const getAllDishes = async (req, res) => {
  try {
    const { restaurantId, category, search, minPrice, maxPrice } = req.query;

    const where = {};

    if (restaurantId) {
      where.restaurantId = restaurantId;
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const dishes = await Dish.findAll({
      where,
      include: [
        {
          model: Restaurant,
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      dishes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dish by ID
const getDishById = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findByPk(id, {
      include: [
        {
          model: Restaurant,
          attributes: ["id", "name", "location", "city"],
        },
      ],
    });

    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    res.status(200).json({
      success: true,
      dish,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update dish
const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, isAvailable, restaurantId } =
      req.body;

    const dish = await Dish.findByPk(id);
    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    // Check if new restaurantId is valid (if provided)
    if (restaurantId && restaurantId !== dish.restaurantId) {
      const restaurant = await Restaurant.findByPk(restaurantId);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }
    }

    // Handle image upload
    let updateData = {
      name: name || dish.name,
      price: price || dish.price,
      description: description !== undefined ? description : dish.description,
      category: category || dish.category,
      isAvailable: isAvailable !== undefined ? isAvailable : dish.isAvailable,
      restaurantId: restaurantId || dish.restaurantId,
    };

    if (req.files && req.files.length > 0) {
      updateData.image = `/uploads/${req.files[0].filename}`;
    }

    await dish.update(updateData);

    res.status(200).json({
      success: true,
      message: "Dish updated successfully",
      dish,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete dish
const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;

    const dish = await Dish.findByPk(id);
    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    await dish.destroy();

    res.status(200).json({
      success: true,
      message: "Dish deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createDish,
  getDishesByRestaurant,
  getAllDishes,
  getDishById,
  updateDish,
  deleteDish,
};

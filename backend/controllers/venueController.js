const Restaurant = require("../models/venueModel");

const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      location,
      cuisine,
      priceRange,
      rating,
      description,
      phone,
      email,
    } = req.body;

    if (!name || !location || !cuisine || !priceRange) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Handle image upload - use uploaded file path or fallback to emoji
    let image = "🍽️";
    if (req.files && req.files.length > 0) {
      image = `/uploads/${req.files[0].filename}`;
    }

    const restaurant = await Restaurant.create({
      name,
      location,
      cuisine,
      priceRange,
      rating: rating || 5.0,
      image,
      description,
      phone,
      email,
    });

    res.status(201).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json({ success: true, restaurants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      location,
      cuisine,
      priceRange,
      rating,
      description,
      phone,
      email,
      availability,
    } = req.body;

    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    // Handle image upload - use new file path or keep existing
    let updateData = {
      name,
      location,
      cuisine,
      priceRange,
      rating,
      description,
      phone,
      email,
      availability,
    };
    if (req.files && req.files.length > 0) {
      updateData.image = `/uploads/${req.files[0].filename}`;
    }

    await restaurant.update(updateData);

    res.json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    await restaurant.destroy();
    res.json({ success: true, message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Keep old function names as aliases for backward compatibility
const createVenue = createRestaurant;
const getAllVenues = getAllRestaurants;
const updateVenue = updateRestaurant;
const deleteVenue = deleteRestaurant;

module.exports = {
  createRestaurant,
  getAllRestaurants,
  updateRestaurant,
  deleteRestaurant,
  createVenue,
  getAllVenues,
  updateVenue,
  deleteVenue,
};

const Venue = require("../models/venueModel");

const createVenue = async (req, res) => {
  try {
    const {
      name,
      location,
      type,
      price,
      rating,
      cuisine,
      description,
      phone,
      email,
    } = req.body;

    if (!name || !location || !type || !price) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Handle image upload - use uploaded file path or fallback to emoji
    let image = "🍽️";
    if (req.files && req.files.length > 0) {
      image = `/uploads/${req.files[0].filename}`;
    }

    const venue = await Venue.create({
      name,
      location,
      type,
      price,
      rating: rating || 5.0,
      image,
      cuisine: cuisine || "",
      description: description || "",
      phone: phone || "",
      email: email || "",
    });

    res.status(201).json({
      success: true,
      venue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll();
    res.json({ success: true, venues });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      location,
      type,
      price,
      rating,
      availability,
      cuisine,
      description,
      phone,
      email,
    } = req.body;

    const venue = await Venue.findByPk(id);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    // Handle image upload - use new file path or keep existing
    let updateData = {
      name,
      location,
      type,
      price,
      rating,
      availability,
      cuisine,
      description,
      phone,
      email,
    };
    if (req.files && req.files.length > 0) {
      updateData.image = `/uploads/${req.files[0].filename}`;
    }

    await venue.update(updateData);

    res.json({ success: true, message: "Venue updated successfully", venue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await Venue.findByPk(id);

    if (!venue) return res.status(404).json({ message: "Venue not found" });

    await venue.destroy();
    res.json({ success: true, message: "Venue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update your exports
module.exports = {
  createRestaurant: createVenue,
  getAllRestaurants: getAllVenues,
  updateRestaurant: updateVenue,
  deleteRestaurant: deleteVenue,
  createVenue,
  getAllVenues,
  updateVenue,
  deleteVenue,
};

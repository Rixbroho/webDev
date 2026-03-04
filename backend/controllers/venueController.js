const Venue = require("../models/venueModel");
const Cuisine = require("../models/cuisineModel");
const RestaurantCuisine = require("../models/restaurantCuisineModel");
const Dish = require("../models/dishModel");
const Review = require("../models/reviewModel");
const { Op } = require("sequelize");

// ==================== HELPER FUNCTIONS ====================

// Calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ==================== CREATE VENUE ====================

const createVenue = async (req, res) => {
  try {
    const {
      name,
      location,
      type,
      price,
      priceRange,
      rating,
      cuisine,
      cuisineIds,
      description,
      phone,
      email,
      city,
      area,
      fullAddress,
      latitude,
      longitude,
    } = req.body;

    if (!name || !location || !type) {
      return res
        .status(400)
        .json({ message: "Name, location, and type are required" });
    }

    let image = "🍽️";
    if (req.files && req.files.length > 0) {
      image = `/uploads/${req.files[0].filename}`;
    }

    const venue = await Venue.create({
      name,
      location,
      type,
      price: price || null,
      priceRange: priceRange || "$$",
      rating: rating || 5.0,
      averageRating: 0,
      totalReviews: 0,
      image,
      cuisine: cuisine || "General",
      description: description || "",
      phone: phone || "",
      email: email || "",
      city: city || "Kathmandu",
      area: area || null,
      fullAddress: fullAddress || null,
      latitude: latitude || null,
      longitude: longitude || null,
    });

    // Handle multiple cuisines - create associations
    if (cuisineIds && Array.isArray(cuisineIds) && cuisineIds.length > 0) {
      const cuisineAssociations = cuisineIds.map((cuisineId) => ({
        restaurantId: venue.id,
        cuisineId: parseInt(cuisineId),
      }));
      await RestaurantCuisine.bulkCreate(cuisineAssociations);
    }

    const createdVenue = await Venue.findByPk(venue.id, {
      include: [
        { model: Cuisine, as: "cuisines", through: { attributes: [] } },
      ],
    });

    res.status(201).json({ success: true, venue: createdVenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET ALL VENUES (ADVANCED FILTERING) ====================

const getAllVenues = async (req, res) => {
  try {
    const {
      city,
      area,
      cuisine,
      dish,
      minRating,
      minPrice,
      maxPrice,
      sort,
      search,
      near, // format: lat,lng
      radius, // radius in km
    } = req.query;

    // Build base where clause
    const where = {};

    // City filter
    if (city && city !== "All") {
      where.city = { [Op.iLike]: `%${city}%` };
    }

    // Area filter
    if (area && area !== "All") {
      where.area = { [Op.iLike]: `%${area}%` };
    }

    // Rating filter (use averageRating for review system)
    if (minRating) {
      where.averageRating = { [Op.gte]: parseFloat(minRating) };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    // Search filter
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { cuisine: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Sorting options
    let order = [["createdAt", "DESC"]];
    switch (sort) {
      case "rating_desc":
        order = [["averageRating", "DESC NULLS LAST"]];
        break;
      case "rating_asc":
        order = [["averageRating", "ASC NULLS LAST"]];
        break;
      case "price_desc":
        order = [["price", "DESC NULLS LAST"]];
        break;
      case "price_asc":
        order = [["price", "ASC NULLS LAST"]];
        break;
      case "name_asc":
        order = [["name", "ASC"]];
        break;
      case "name_desc":
        order = [["name", "DESC"]];
        break;
      case "newest":
        order = [["createdAt", "DESC"]];
        break;
      case "oldest":
        order = [["createdAt", "ASC"]];
        break;
      case "top_rated":
        order = [["averageRating", "DESC NULLS LAST"]];
        break;
      default:
        order = [["createdAt", "DESC"]];
    }

    // Build include array - handle potential association issues
    let include = [];

    try {
      // Try to include cuisines if the association exists
      include = [
        {
          model: Cuisine,
          as: "cuisines",
          through: { attributes: [] },
          required: false,
        },
      ];

      if (cuisine) {
        const cuisineList = cuisine.split(",").map((c) => c.trim());
        // Fix: Properly construct Op.or array for Sequelize
        include[0].where = {
          [Op.or]: cuisineList.map((c) => ({ name: { [Op.iLike]: `%${c}%` } })),
        };
        // when filtering by cuisine we only want venues that have matching cuisine
        include[0].required = true;
      }
    } catch (includeError) {
      console.error("Error setting up cuisine include:", includeError.message);
      // Continue without cuisine include if it fails
    }

    if (dish) {
      try {
        include.push({
          model: Dish,
          as: "dishes",
          where: {
            name: { [Op.iLike]: `%${dish}%` },
          },
          required: true,
        });
      } catch (dishError) {
        console.error("Error setting up dish include:", dishError.message);
      }
    }

    // Query venues with includes and where clause
    let venues = await Venue.findAll({
      where,
      include,
      order,
      distinct: true,
    });

    // Handle "near me" filtering with distance (still done in JS since SQL calculation is complex)
    if (near) {
      const [userLat, userLng] = near.split(",").map(parseFloat);
      const radiusKm = parseFloat(radius) || 10; // Default 10km

      const venuesWithDistance = venues
        .filter((v) => v.latitude && v.longitude)
        .map((v) => ({
          ...v.toJSON(),
          distance: calculateDistance(
            userLat,
            userLng,
            parseFloat(v.latitude),
            parseFloat(v.longitude),
          ),
        }))
        .filter((v) => v.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);

      venues = venuesWithDistance;

      if (sort === "nearest" || !sort) {
        venues.sort((a, b) => a.distance - b.distance);
      }
    }

    // Get filters data - wrap in try-catch to prevent crash
    let cities = [];
    let areas = [];
    let cuisineNames = [];

    try {
      const allVenues = await Venue.findAll({ attributes: ["city", "area"] });
      cities = [...new Set(allVenues.map((v) => v.city).filter(Boolean))];
      areas = [...new Set(allVenues.map((v) => v.area).filter(Boolean))];
    } catch (filterError) {
      console.error("Error getting filter data:", filterError.message);
    }

    // Get all cuisines - wrap in try-catch
    try {
      const allCuisines = await Cuisine.findAll();
      cuisineNames = allCuisines.map((c) => c.name);
    } catch (cuisineError) {
      console.error("Error getting cuisines:", cuisineError.message);
    }

    // Try to get cuisine names from junction table, but don't fail if it doesn't work
    try {
      const restaurantCuisines = await RestaurantCuisine.findAll({
        include: [{ model: Cuisine, as: "Cuisine", required: false }],
      });
      const rcNames = [
        ...new Set(
          restaurantCuisines.map((rc) => rc.Cuisine?.name).filter(Boolean),
        ),
      ];
      if (rcNames.length > 0) {
        cuisineNames = rcNames;
      }
    } catch (rcError) {
      console.error("Error getting restaurant cuisines:", rcError.message);
    }

    res.json({
      success: true,
      venues,
      filters: {
        cities,
        areas,
        cuisines: cuisineNames,
      },
      total: venues.length,
    });
  } catch (error) {
    console.error("Error in getAllVenues:", error);
    res.status(500).json({
      message: error.message,
      success: false,
      venues: [],
      filters: { cities: [], areas: [], cuisines: [] },
    });
  }
};

// ==================== UPDATE VENUE ====================

const updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      location,
      type,
      price,
      priceRange,
      rating,
      availability,
      cuisine,
      cuisineIds,
      description,
      phone,
      email,
      city,
      area,
      fullAddress,
      latitude,
      longitude,
    } = req.body;

    const venue = await Venue.findByPk(id);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    let updateData = {
      name,
      location,
      type,
      price,
      priceRange,
      rating,
      availability,
      cuisine,
      description,
      phone,
      email,
      city,
      area,
      fullAddress,
      latitude,
      longitude,
    };
    if (req.files && req.files.length > 0) {
      updateData.image = `/uploads/${req.files[0].filename}`;
    }

    await venue.update(updateData);

    // Update cuisine associations
    if (cuisineIds && Array.isArray(cuisineIds)) {
      await RestaurantCuisine.destroy({ where: { restaurantId: id } });
      if (cuisineIds.length > 0) {
        const cuisineAssociations = cuisineIds.map((cuisineId) => ({
          restaurantId: venue.id,
          cuisineId: parseInt(cuisineId),
        }));
        await RestaurantCuisine.bulkCreate(cuisineAssociations);
      }
    }

    const updatedVenue = await Venue.findByPk(id, {
      include: [
        { model: Cuisine, as: "cuisines", through: { attributes: [] } },
      ],
    });

    res.json({
      success: true,
      message: "Venue updated successfully",
      venue: updatedVenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== DELETE VENUE ====================

const deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await Venue.findByPk(id);

    if (!venue) return res.status(404).json({ message: "Venue not found" });

    // Delete associated records
    await RestaurantCuisine.destroy({ where: { restaurantId: id } });
    await Review.destroy({ where: { restaurantId: id } });
    await Dish.destroy({ where: { restaurantId: id } });

    await venue.destroy();
    res.json({ success: true, message: "Venue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET SINGLE VENUE ====================

const getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const { near } = req.query;

    const venue = await Venue.findByPk(id, {
      include: [
        { model: Cuisine, as: "cuisines", through: { attributes: [] } },
      ],
    });

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    let venueData = venue.toJSON();

    // Calculate distance if near param provided
    if (near) {
      const [userLat, userLng] = near.split(",").map(parseFloat);
      if (venue.latitude && venue.longitude) {
        venueData.distance = calculateDistance(
          userLat,
          userLng,
          parseFloat(venue.latitude),
          parseFloat(venue.longitude),
        );
      }
    }

    // Get reviews for this restaurant
    const reviews = await Review.findAll({
      where: { restaurantId: id },
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    // Get rating distribution
    const allReviews = await Review.findAll({ where: { restaurantId: id } });
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allReviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    res.json({
      success: true,
      venue: venueData,
      reviews,
      reviewStats: {
        averageRating: venue.averageRating,
        totalReviews: venue.totalReviews,
        distribution,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== EXPORTS ====================

module.exports = {
  createRestaurant: createVenue,
  getAllRestaurants: getAllVenues,
  updateRestaurant: updateVenue,
  deleteRestaurant: deleteVenue,
  getVenueById,
  createVenue,
  getAllVenues,
  updateVenue,
  deleteVenue,
};

const Review = require("../models/reviewModel");
const Restaurant = require("../models/venueModel");
const { Op } = require("sequelize");

// Helper function to update restaurant average rating
const updateRestaurantRating = async (restaurantId) => {
  const reviews = await Review.findAll({
    where: { restaurantId },
  });

  if (reviews.length === 0) {
    await Restaurant.update(
      { averageRating: 0, totalReviews: 0 },
      { where: { id: restaurantId } },
    );
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Restaurant.update(
    { averageRating: Math.round(averageRating * 10) / 10, totalReviews: reviews.length },
    { where: { id: restaurantId } },
  );
};

// Create a review
const createReview = async (req, res) => {
  try {
    const { rating, comment, restaurantId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Please login to add a review" });
    }

    if (!rating || !restaurantId) {
      return res.status(400).json({ success: false, message: "Rating and restaurant ID are required" });
    }

    // Check if user already reviewed this restaurant
    const existingReview = await Review.findOne({
      where: { userId, restaurantId },
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already reviewed this restaurant. You can edit your existing review." 
      });
    }

    // Verify restaurant exists
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    const review = await Review.create({
      rating,
      comment: comment || "",
      userId,
      restaurantId,
    });

    // Update restaurant rating
    await updateRestaurantRating(restaurantId);

    // Fetch review with user data
    const reviewWithUser = await Review.findByPk(review.id, {
      include: [
        { model: Restaurant, as: "restaurant", attributes: ["id", "name"] },
      ],
    });

    res.status(201).json({ success: true, review: reviewWithUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reviews for a restaurant
const getRestaurantReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { restaurantId },
      include: [
        { 
          model: Restaurant, 
          as: "restaurant", 
          attributes: ["id", "name", "image"] 
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Get rating distribution
    const allReviews = await Review.findAll({ where: { restaurantId } });
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allReviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    res.json({
      success: true,
      reviews,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
      distribution,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's review for a restaurant
const getUserReviewForRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Please login" });
    }

    const review = await Review.findOne({
      where: { userId, restaurantId },
    });

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Check ownership
    if (review.userId !== userId) {
      return res.status(403).json({ success: false, message: "You can only edit your own reviews" });
    }

    await review.update({ rating, comment });

    // Update restaurant rating
    await updateRestaurantRating(review.restaurantId);

    const updatedReview = await Review.findByPk(id, {
      include: [
        { model: Restaurant, as: "restaurant", attributes: ["id", "name"] },
      ],
    });

    res.json({ success: true, review: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Check ownership or admin
    if (review.userId !== userId && userRole !== "admin") {
      return res.status(403).json({ success: false, message: "You cannot delete this review" });
    }

    const restaurantId = review.restaurantId;
    await review.destroy();

    // Update restaurant rating
    await updateRestaurantRating(restaurantId);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews (admin)
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      include: [
        { model: Restaurant, as: "restaurant", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      reviews,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getRestaurantReviews,
  getUserReviewForRestaurant,
  updateReview,
  deleteReview,
  getAllReviews,
};

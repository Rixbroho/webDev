import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAdminStats = async (req, res) => {
  try {
    // Total restaurants
    const totalRestaurants = await prisma.restaurant.count();

    // Total users
    const totalUsers = await prisma.user.count();

    // Monthly revenue (assuming revenue from reviews, but since no price field, using review count * 10 as mock)
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const monthlyReviews = await prisma.review.count({
      where: {
        createdAt: {
          gte: currentMonth,
        },
      },
    });
    const monthlyRevenue = monthlyReviews * 10; // Mock calculation

    // Average rating across all restaurants
    const avgRatingResult = await prisma.restaurant.aggregate({
      _avg: {
        averageRating: true,
      },
    });
    const averageRating = avgRatingResult._avg.averageRating || 0;

    res.json({
      success: true,
      stats: {
        totalRestaurants,
        totalUsers,
        monthlyRevenue,
        averageRating,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAdminStats };

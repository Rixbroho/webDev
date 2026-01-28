const createReview = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { restaurantId, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if user already reviewed this restaurant
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId: parseInt(restaurantId),
        },
      },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You have already reviewed this restaurant",
        });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        restaurantId: parseInt(restaurantId),
        rating: parseInt(rating),
        comment,
      },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    // Update average rating
    await updateAverageRating(prisma, restaurantId);

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReviewsByRestaurant = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { restaurantId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { restaurantId: parseInt(restaurantId) },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const userId = req.user.id;

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (review.userId !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only delete your own reviews",
        });
    }

    await prisma.review.delete({
      where: { id: parseInt(id) },
    });

    // Update average rating
    await updateAverageRating(prisma, review.restaurantId);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAverageRating = async (prisma, restaurantId) => {
  const reviews = await prisma.review.findMany({
    where: { restaurantId: parseInt(restaurantId) },
    select: { rating: true },
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  await prisma.restaurant.update({
    where: { id: parseInt(restaurantId) },
    data: { averageRating },
  });
};

export {
  createReview,
  getReviewsByRestaurant,
  deleteReview,
};

const getUserReviews = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const userId = req.user.id;

    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        restaurant: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, reviews });
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

const createReview = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { restaurantId, rating, comment } = req.body;
    const userId = req.user.id;

    const review = await prisma.review.create({
      data: {
        userId,
        restaurantId: parseInt(restaurantId),
        rating: parseInt(rating),
        comment,
      },
    });

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

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (review.userId !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await prisma.review.delete({
      where: { id: parseInt(id) },
    });

    await updateAverageRating(prisma, review.restaurantId);

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createReview, getReviewsByRestaurant, deleteReview, getUserReviews };

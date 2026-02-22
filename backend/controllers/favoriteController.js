const getFavorites = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const userId = req.user.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            averageRating: true,
            cuisine: true,
            city: true,
          },
        },
      },
    });

    res.json({ success: true, favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { restaurantId } = req.body;
    const userId = req.user.id;

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        restaurantId: parseInt(restaurantId),
      },
    });

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    if (error.code === "P2002") {
      res.status(400).json({ success: false, message: "Already in favorites" });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

const removeFavorite = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { restaurantId } = req.params;
    const userId = req.user.id;

    await prisma.favorite.deleteMany({
      where: {
        userId,
        restaurantId: parseInt(restaurantId),
      },
    });

    res.json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getFavorites, addFavorite, removeFavorite };

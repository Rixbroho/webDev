const addFavorite = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { restaurantId } = req.params;
    const userId = req.user.id;

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId: parseInt(restaurantId),
        },
      },
    });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ success: false, message: "Restaurant already in favorites" });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        restaurantId: parseInt(restaurantId),
      },
    });

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { restaurantId } = req.params;
    const userId = req.user.id;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId: parseInt(restaurantId),
        },
      },
    });

    if (!favorite) {
      return res
        .status(404)
        .json({ success: false, message: "Favorite not found" });
    }

    await prisma.favorite.delete({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId: parseInt(restaurantId),
        },
      },
    });

    res.json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserFavorites = async (req, res) => {
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
            cuisine: true,
            city: true,
            priceRange: true,
            averageRating: true,
            imageUrl: true,
          },
        },
      },
    });

    const restaurants = favorites.map((fav) => fav.restaurant);

    res.json({ success: true, favorites: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addFavorite, removeFavorite, getUserFavorites };

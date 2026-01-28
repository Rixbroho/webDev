const getAllRestaurants = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const {
      search,
      cuisine,
      city,
      minRating,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (cuisine) where.cuisine = cuisine;
    if (city) where.city = city;
    if (minRating) where.averageRating = { gte: parseFloat(minRating) };

    const orderBy = {};
    if (sortBy === "rating") orderBy.averageRating = "desc";
    else if (sortBy === "price") orderBy.priceRange = "asc";
    else orderBy.createdAt = "desc";

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const restaurants = await prisma.restaurant.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        name: true,
        cuisine: true,
        city: true,
        priceRange: true,
        averageRating: true,
        imageUrl: true,
      },
    });

    const total = await prisma.restaurant.count({ where });

    res.json({
      success: true,
      restaurants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: parseInt(id) },
      include: {
        reviews: {
          include: {
            user: { select: { id: true, username: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    res.json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const {
      name,
      description,
      cuisine,
      address,
      city,
      latitude,
      longitude,
      priceRange,
      imageUrl,
    } = req.body;

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        cuisine,
        address,
        city,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        priceRange,
        imageUrl,
      },
    });

    res.status(201).json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllRestaurants, getRestaurantById, createRestaurant };

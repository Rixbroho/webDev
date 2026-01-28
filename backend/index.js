import express from "express";

import { PrismaClient } from "@prisma/client";

import cors from "cors";

import userRoutes from "./routes/route.js";

import restaurantRoutes from "./routes/restaurantRoute.js";

import reviewRoutes from "./routes/reviewRoute.js";

import favoriteRoutes from "./routes/favoriteRoute.js";

const app = express();

const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",

    credentials: true,
  }),
);

app.use(express.json());

// Initialize Prisma

const prisma = new PrismaClient();

app.locals.prisma = prisma;

// Routes

app.use("/api/user/", userRoutes);

app.use("/api/restaurants/", restaurantRoutes);

app.use("/api/reviews/", reviewRoutes);

app.use("/api/favorites/", favoriteRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Restaurant Finder API!" });
});

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("Database connected successfully.");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);

    process.exit(1);
  }
};

startServer();

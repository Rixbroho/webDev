import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Sample restaurants
  const restaurants = [
    {
      name: "Bella Italia",
      description: "Authentic Italian cuisine in the heart of the city.",
      cuisine: "Italian",
      address: "123 Main St",
      city: "New York",
      priceRange: "$$",
      imageUrl: "https://example.com/bella-italia.jpg",
    },
    {
      name: "Sushi Zen",
      description: "Fresh sushi and Japanese delicacies.",
      cuisine: "Japanese",
      address: "456 Oak Ave",
      city: "Los Angeles",
      priceRange: "$$$",
      imageUrl: "https://example.com/sushi-zen.jpg",
    },
    {
      name: "Taco Fiesta",
      description: "Vibrant Mexican flavors with a modern twist.",
      cuisine: "Mexican",
      address: "789 Pine Rd",
      city: "Chicago",
      priceRange: "$",
      imageUrl: "https://example.com/taco-fiesta.jpg",
    },
  ];

  for (const restaurant of restaurants) {
    await prisma.restaurant.upsert({
      where: { name: restaurant.name },
      update: {},
      create: restaurant,
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

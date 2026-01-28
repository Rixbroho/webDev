import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("");
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);

  useEffect(() => {
    fetchFeaturedRestaurants();
  }, []);

  const fetchFeaturedRestaurants = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/restaurants?sortBy=rating&limit=6",
      );
      setFeaturedRestaurants(response.data.restaurants);
    } catch (error) {
      console.error("Error fetching featured restaurants:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to restaurants page with search params
    window.location.href = `/restaurants?search=${searchTerm}&city=${city}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Find the Best Restaurants Near You
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover amazing restaurants, read reviews, and save your
              favorites
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto bg-white rounded-lg p-2 shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Restaurant name or cuisine"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-md border-0 focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-md border-0 focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-8">
              <Link
                to="/restaurants"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors"
              >
                Explore All Restaurants
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Featured Restaurants
        </h2>

        {featuredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {restaurant.imageUrl ? (
                    <img
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-4xl">🍽️</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {restaurant.cuisine} • {restaurant.city}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold">
                      {restaurant.priceRange}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="font-semibold">
                        {restaurant.averageRating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/restaurants/${restaurant.id}`}
                    className="mt-4 inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500 text-lg">
              Loading featured restaurants...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

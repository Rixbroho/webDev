import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/favorites", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (restaurantId) => {
    if (!confirm("Remove this restaurant from favorites?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/favorites/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setFavorites(favorites.filter((fav) => fav.id !== restaurantId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            Please login to view your favorites
          </p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Favorite Restaurants
          </h1>
          <p className="text-gray-600">Restaurants you've saved for later</p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((restaurant) => (
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
                  <div className="flex items-center justify-between mb-4">
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
                  <div className="flex space-x-2">
                    <Link
                      to={`/restaurants/${restaurant.id}`}
                      className="flex-1 text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(restaurant.id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start exploring restaurants and save your favorites!
            </p>
            <Link
              to="/restaurants"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Explore Restaurants
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

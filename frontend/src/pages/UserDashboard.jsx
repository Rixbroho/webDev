import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getFavorites,
  getUserReviews,
  getRecommendedRestaurants,
} from "../services/api";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [favRes, revRes, recRes] = await Promise.all([
          getFavorites(),
          getUserReviews(),
          getRecommendedRestaurants(),
        ]);

        if (favRes?.data?.success) setFavorites(favRes.data.favorites);
        if (revRes?.data?.success) setReviews(revRes.data.reviews);
        if (recRes?.data?.success)
          setRecommendations(recRes.data.recommendations);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const removeFavorite = async (restaurantId) => {
    // Implement remove favorite logic
    toast.success("Removed from favorites");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.username}!
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search your saved items..."
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-colors font-semibold">
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Favorites Carousel */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Favorite Spots
              </h2>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  >
                    <img
                      src={fav.restaurant.imageUrl || "/placeholder.jpg"}
                      alt={fav.restaurant.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {fav.restaurant.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-sm text-gray-600">
                            {fav.restaurant.averageRating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFavorite(fav.restaurantId)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          ♥
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Recent Activity
              </h2>
              <div className="space-y-4">
                {/* Recent Reviews */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Recent Reviews
                  </h3>
                  {reviews.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.restaurant.name}
                        </p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pending Reservations */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pending Reservations
                  </h3>
                  <p className="text-gray-600">No pending reservations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recommended for You
              </h3>
              <div className="space-y-4">
                {recommendations.slice(0, 5).map((rec) => (
                  <div key={rec.id} className="flex items-center space-x-3">
                    <img
                      src={rec.imageUrl || "/placeholder.jpg"}
                      alt={rec.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {rec.name}
                      </p>
                      <p className="text-xs text-gray-600">{rec.cuisine}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const RestaurantDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchRestaurantDetails();
    if (user) {
      checkIfFavorite();
    }
  }, [id, user]);

  const fetchRestaurantDetails = async () => {
    try {
      const [restaurantRes, reviewsRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/restaurants/${id}`),
        axios.get(`http://localhost:3000/api/reviews/${id}`),
      ]);
      setRestaurant(restaurantRes.data.restaurant);
      setReviews(reviewsRes.data.reviews);
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/favorites", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const isFav = response.data.favorites.some(
        (fav) => fav.id === parseInt(id),
      );
      setIsFavorite(isFav);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:3000/api/favorites/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setIsFavorite(false);
      } else {
        await axios.post(
          `http://localhost:3000/api/favorites/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to leave a review");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/reviews",
        {
          restaurantId: id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      setReviewForm({ rating: 5, comment: "" });
      setShowReviewForm(false);
      fetchRestaurantDetails(); // Refresh data
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchRestaurantDetails(); // Refresh data
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-500" : "text-gray-300"}
      >
        ⭐
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Restaurant not found
          </h2>
          <Link to="/restaurants" className="text-blue-600 hover:text-blue-800">
            Back to restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="h-96 bg-gray-200 flex items-center justify-center relative">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-8xl">🍽️</div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-8 text-white w-full">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                <p className="text-xl text-gray-200">
                  {restaurant.cuisine} • {restaurant.city}
                </p>
              </div>
              {user && (
                <button
                  onClick={handleFavoriteToggle}
                  className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                    isFavorite
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {isFavorite
                    ? "❤️ Remove from Favorites"
                    : "🤍 Add to Favorites"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Restaurant Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {renderStars(Math.round(restaurant.averageRating || 0))}
                    <span className="ml-2 text-lg font-semibold">
                      {restaurant.averageRating?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
                <span className="text-green-600 font-semibold text-lg">
                  {restaurant.priceRange}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">{restaurant.address}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">City</h3>
                  <p className="text-gray-600">{restaurant.city}</p>
                </div>
              </div>

              {restaurant.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600">{restaurant.description}</p>
                </div>
              )}
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="text-gray-500">Map integration would go here</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {restaurant.latitude && restaurant.longitude
                      ? `${restaurant.latitude}, ${restaurant.longitude}`
                      : "Location coordinates not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Reviews</h3>
                {user && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {showReviewForm ? "Cancel" : "Write Review"}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="mb-8 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          rating: parseInt(e.target.value),
                        }))
                      }
                      className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[5, 4, 3, 2, 1].map((num) => (
                        <option key={num} value={num}>
                          {num} Star{num !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Share your experience..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-6 last:border-b-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">
                            {review.user.username}
                          </span>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        {user && user.id === review.user.id && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-gray-500">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/restaurants"
                  className="block w-full text-center bg-gray-100 text-gray-900 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Back to Restaurants
                </Link>
                {user && (
                  <Link
                    to="/favorites"
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Favorites
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;

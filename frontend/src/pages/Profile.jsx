import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      // This would require a new endpoint to get user's reviews
      // For now, we'll show a placeholder
      setUserReviews([]);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserReviews(userReviews.filter((review) => review.id !== reviewId));
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            Please login to view your profile
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.username}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 capitalize">
                Role: {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* My Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">My Reviews</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading reviews...</p>
            </div>
          ) : userReviews.length > 0 ? (
            <div className="space-y-6">
              {userReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">
                        {review.restaurant?.name}
                      </span>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start exploring restaurants and leave your first review!
              </p>
              <a
                href="/restaurants"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
              >
                Explore Restaurants
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

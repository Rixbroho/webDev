import React from "react";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    return [...Array(5)].map((_, i) => {
      if (i < fullStars) {
        return (
          <span key={i} className="text-yellow-500">
            ⭐
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        return (
          <span key={i} className="text-yellow-500">
            ⭐
          </span>
        ); // Could use half star if available
      } else {
        return (
          <span key={i} className="text-gray-300">
            ☆
          </span>
        );
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
        <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
        <p className="text-gray-600 mb-2">
          {restaurant.cuisine} • {restaurant.city}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-green-600 font-semibold">
            {restaurant.priceRange}
          </span>
          <div className="flex items-center">
            <div className="flex mr-2">
              {renderStars(restaurant.averageRating)}
            </div>
            <span className="font-semibold text-sm">
              {restaurant.averageRating?.toFixed(1) || "N/A"}
            </span>
          </div>
        </div>
        <Link
          to={`/restaurants/${restaurant.id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;

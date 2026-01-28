import React, { useState, useEffect } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    cuisine: "",
    city: "",
    minRating: "",
    sortBy: "createdAt",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchRestaurants();
  }, [filters, pagination.page]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      const response = await axios.get(
        `http://localhost:3000/api/restaurants?${params}`,
      );
      setRestaurants(response.data.restaurants);
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
      }));
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      cuisine: "",
      city: "",
      minRating: "",
      sortBy: "createdAt",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurants</h1>
          <p className="text-gray-600">
            Discover the best restaurants in your area
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Restaurant name or cuisine"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Cuisine */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cuisine
                  </label>
                  <select
                    value={filters.cuisine}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        cuisine: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Cuisines</option>
                    <option value="Italian">Italian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Indian">Indian</option>
                    <option value="American">American</option>
                    <option value="Thai">Thai</option>
                    <option value="French">French</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    value={filters.city}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minRating: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="createdAt">Newest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price">Lowest Price</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={fetchRestaurants}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={clearFilters}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurants Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : restaurants.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {restaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>

                    {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 border rounded-md ${
                            pagination.page === pageNum
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No restaurants found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;

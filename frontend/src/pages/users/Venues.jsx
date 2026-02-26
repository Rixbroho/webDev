import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  Users,
  Loader2,
  X,
  Calendar,
  Utensils,
  Filter,
  SlidersHorizontal,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Navigation,
} from "lucide-react";
import { toast } from "react-toastify";
import Nav from "../components/Nav";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import {
  getAllRestaurants,
  createBooking,
  getRestaurantBookings,
  getAllCuisines,
  getRestaurantReviews,
  getUserReviewForRestaurant,
  getRestaurantById,
} from "../../services/api";

const Venues = ({ user, onLogout, setCurrentPage }) => {
  const [activeNavTab, setActiveNavTab] = useState("Restaurants");
  const [searchTerm, setSearchTerm] = useState("");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    guests: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  // Review states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Location "near me" feature
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const [filters, setFilters] = useState({
    city: "",
    area: "",
    cuisine: "",
    dish: "",
    minRating: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
    near: "",
    radius: "",
  });

  const handleNavTabChange = (tab) => {
    setActiveNavTab(tab);
    setCurrentPage(tab.toLowerCase());
  };

  // Get user location for "near me" feature
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Location not available:", error.message);
        },
      );
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        try {
          const cuisineRes = await getAllCuisines();
          if (cuisineRes.data.success)
            setCuisines(cuisineRes.data.cuisines || []);
        } catch (e) {
          console.log("Cuisines not available");
        }
        await fetchRestaurants();
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.area) params.area = filters.area;
      if (filters.cuisine) params.cuisine = filters.cuisine;
      if (filters.dish) params.dish = filters.dish;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sort) params.sort = filters.sort;
      if (filters.near) params.near = filters.near;
      if (filters.radius) params.radius = filters.radius;
      if (searchTerm) params.search = searchTerm;

      const response = await getAllRestaurants(params);
      if (response.data.success) {
        setVenues(response.data.venues || []);
        if (response.data.filters) {
          if (response.data.filters.cities)
            setCities(response.data.filters.cities);
          if (response.data.filters.areas)
            setAreas(response.data.filters.areas);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchRestaurants(), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const applyFilters = () => {
    fetchRestaurants();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      city: "",
      area: "",
      cuisine: "",
      dish: "",
      minRating: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
      near: "",
      radius: "",
    });
    setSearchTerm("");
    fetchRestaurants();
  };

  const enableNearMe = () => {
    if (!userLocation) {
      toast.error("Location not available. Please enable location access.");
      return;
    }
    setFilters((prev) => ({
      ...prev,
      near: `${userLocation.lat},${userLocation.lng}`,
      radius: "10",
    }));
    toast.success("Showing restaurants near you!");
  };

  const disableNearMe = () => {
    setFilters((prev) => ({
      ...prev,
      near: "",
      radius: "",
    }));
    fetchRestaurants();
  };

  const handleOpenBookingModal = (venue) => {
    setSelectedVenue(venue);
    setBookingData({ date: "", time: "", guests: "" });
    setUnavailableSlots([]);
    setIsModalOpen(true);
  };

  const handleOpenReviewModal = async (venue) => {
    setSelectedVenue(venue);
    setShowReviewModal(true);
    await loadReviews(venue.id);
  };

  const loadReviews = async (restaurantId) => {
    setReviewsLoading(true);
    try {
      const [reviewsRes, userReviewRes] = await Promise.all([
        getRestaurantReviews(restaurantId),
        getUserReviewForRestaurant(restaurantId).catch(() => ({
          data: { review: null },
        })),
      ]);

      if (reviewsRes.data.success) {
        setReviews(reviewsRes.data.reviews || []);
      }
      if (userReviewRes.data.success) {
        setUserReview(userReviewRes.data.review);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmitted = async () => {
    if (selectedVenue) {
      await loadReviews(selectedVenue.id);
      // Also refresh the venue to get updated rating
      try {
        const venueRes = await getRestaurantById(selectedVenue.id);
        if (venueRes.data.success) {
          setSelectedVenue(venueRes.data.venue);
          // Update in list
          setVenues((prev) =>
            prev.map((v) =>
              v.id === selectedVenue.id ? venueRes.data.venue : v,
            ),
          );
        }
      } catch (error) {
        console.error("Error refreshing venue:", error);
      }
    }
  };

  const handleDateChange = async (e) => {
    const today = new Date();
    const selectedDate = new Date(e.target.value);
    if (selectedDate <= today.setHours(0, 0, 0, 0)) {
      toast.error("Cannot select past date");
      return;
    }
    setBookingData({ ...bookingData, date: e.target.value });
    try {
      if (selectedVenue?.id) {
        const res = await getRestaurantBookings(
          selectedVenue.id,
          e.target.value,
        );
        if (res.data.success)
          setUnavailableSlots(res.data.bookings.map((b) => b.time));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingData.date || !bookingData.time || !bookingData.guests) {
      toast.error("Fill all details");
      return;
    }
    setBookingLoading(true);
    try {
      const response = await createBooking({
        restaurantId: selectedVenue.id,
        restaurantName: selectedVenue.name,
        location: selectedVenue.location,
        cuisine: selectedVenue.type,
        date: bookingData.date,
        time: bookingData.time,
        guests: bookingData.guests,
        priceRange: selectedVenue.price,
        price: selectedVenue.price,
      });
      if (response.data.success) {
        toast.success("Reserved!");
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const timeSlots = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
  ];

  const filteredVenues = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] font-sans">
      <Nav
        activeTab={activeNavTab}
        setActiveTab={handleNavTabChange}
        onLogout={onLogout}
      />
      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <header className="fixed top-0 right-0 left-0 h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 md:left-64 z-40 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
            Find <span className="text-orange-500">Restaurants</span>
          </h2>
          <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
            {userLocation && (
              <button
                onClick={filters.near ? disableNearMe : enableNearMe}
                className={`px-3 py-2 rounded-full flex items-center gap-2 text-sm font-semibold ${
                  filters.near
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Navigation size={16} />
                {filters.near ? "Near Me On" : "Near Me"}
              </button>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none mb-1">
                {user?.username || "Guest"}
              </p>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                {user?.role || "Foodie"}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl shadow-lg flex items-center justify-center text-white font-black text-lg">
              {user?.username
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 pt-32">
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
              size={24}
            />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-32 py-5 bg-white border-2 border-slate-100 rounded-[2rem] text-lg outline-none focus:border-orange-500 shadow-lg"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center gap-2 text-sm font-semibold text-slate-600"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Filter size={20} className="text-orange-500" />
                  Advanced Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-orange-500"
                >
                  Reset All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                    City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                    className="w-full p-3 bg-slate-50 border rounded-lg text-sm"
                  >
                    <option value="">All Cities</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                    Area
                  </label>
                  <select
                    value={filters.area}
                    onChange={(e) => handleFilterChange("area", e.target.value)}
                    className="w-full p-3 bg-slate-50 border rounded-lg text-sm"
                  >
                    <option value="">All Areas</option>
                    {areas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                    Cuisine
                  </label>
                  <select
                    value={filters.cuisine}
                    onChange={(e) =>
                      handleFilterChange("cuisine", e.target.value)
                    }
                    className="w-full p-3 bg-slate-50 border rounded-lg text-sm"
                  >
                    <option value="">All Cuisines</option>
                    {cuisines.map((c) => (
                      <option key={c.id || c} value={c.name || c}>
                        {c.name || c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                    Min Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) =>
                      handleFilterChange("minRating", e.target.value)
                    }
                    className="w-full p-3 bg-slate-50 border rounded-lg text-sm"
                  >
                    <option value="">Any Rating</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                    Min Price
                  </label>
                  <select
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                    className="w-full p-3 bg-slate-50 border rounded-lg text-sm"
                  >
                    <option value="">Any</option>
                    <option value="100">₹100+</option>
                    <option value="300">₹300+</option>
                    <option value="500">₹500+</option>
                    <option value="1000">₹1000+</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                    Max Price
                  </label>
                  <select
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="w-full p-3 bg-slate-50 border rounded-lg text-sm"
                  >
                    <option value="">Any</option>
                    <option value="500">Up to ₹500</option>
                    <option value="1000">Up to ₹1000</option>
                    <option value="2000">Up to ₹2000</option>
                    <option value="5000">Up to ₹5000</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className="w-full p-3 bg-slate-50 border rounded-lg text-sm"
                  >
                    <option value="">Newest First</option>
                    <option value="rating_desc">Highest Rated</option>
                    <option value="rating_asc">Lowest Rated</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="nearest">Nearest</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={applyFilters}
                    className="w-full py-3 bg-orange-500 text-white rounded-lg font-bold text-sm"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-6" />
              <p className="text-slate-500 font-black uppercase">Loading...</p>
            </div>
          ) : filteredVenues.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <Utensils size={64} className="text-slate-200 mb-6" />
              <h3 className="text-2xl font-black text-slate-600 mb-4">
                No Restaurants Found
              </h3>
              <p className="text-slate-400">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVenues.map((venue) => (
                <div
                  key={venue.id}
                  className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all hover:-translate-y-2 group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {venue.image?.startsWith("/uploads") ? (
                      <img
                        src={`http://localhost:3000${venue.image}`}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center text-8xl">
                        {venue.image || "🍽️"}
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/95 px-4 py-1.5 rounded-full text-[10px] font-black text-orange-600 uppercase">
                      {venue.type || venue.cuisine || "Restaurant"}
                    </div>
                    {venue.distance && (
                      <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-green-600">
                        {venue.distance.toFixed(1)} km
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black group-hover:text-orange-600">
                          {venue.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                          <MapPin size={16} className="text-orange-500" />
                          <span>{venue.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                        <Star
                          size={14}
                          className="text-orange-500 fill-current"
                        />
                        <span className="text-sm font-black">
                          {venue.averageRating?.toFixed(1) ||
                            venue.rating ||
                            "New"}
                        </span>
                      </div>
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="font-bold">
                          {venue.averageRating?.toFixed(1) || "New"}
                        </span>
                        <span className="text-slate-400">
                          ({venue.totalReviews || 0} reviews)
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenReviewModal(venue)}
                        className="flex items-center gap-1 text-orange-500 hover:text-orange-600"
                      >
                        <MessageSquare size={14} />
                        <span className="font-semibold">Reviews</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-orange-600 font-black text-xl">
                          {venue.price || venue.priceRange || "$$"}
                        </p>
                        <span className="text-[10px] text-slate-400 uppercase">
                          Price
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenBookingModal(venue)}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-black text-xs uppercase shadow-lg hover:scale-105"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {isModalOpen && selectedVenue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6"
            >
              <X size={24} className="text-slate-400" />
            </button>
            <div className="mb-8">
              <h3 className="text-2xl font-black">Reserve Table</h3>
              <p className="text-slate-500">
                at{" "}
                <span className="text-orange-600 font-bold">
                  {selectedVenue.name}
                </span>
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                  Date
                </label>
                <div className="flex items-center bg-slate-50 rounded-lg px-3 border">
                  <Calendar size={18} className="text-orange-500" />
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={handleDateChange}
                    className="w-full p-3 bg-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                  Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() =>
                        !unavailableSlots.includes(time) &&
                        setBookingData({ ...bookingData, time })
                      }
                      disabled={unavailableSlots.includes(time)}
                      className={`py-2 rounded-lg text-sm font-semibold ${
                        bookingData.time === time
                          ? "bg-orange-500 text-white"
                          : unavailableSlots.includes(time)
                            ? "bg-slate-100 text-slate-300 line-through"
                            : "bg-slate-50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                  Guests
                </label>
                <div className="flex items-center bg-slate-50 rounded-lg px-3 border">
                  <Users size={18} className="text-orange-500" />
                  <input
                    type="number"
                    min="1"
                    value={bookingData.guests}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, guests: e.target.value })
                    }
                    className="w-full p-3 bg-transparent outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
                >
                  {bookingLoading ? "..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedVenue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-6 right-6"
            >
              <X size={24} className="text-slate-400" />
            </button>

            {/* Restaurant Info */}
            <div className="mb-6">
              <h3 className="text-2xl font-black">{selectedVenue.name}</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">
                    {selectedVenue.averageRating?.toFixed(1) || "New"}
                  </span>
                  <span className="text-slate-400">
                    ({selectedVenue.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            {selectedVenue.reviewStats?.distribution && (
              <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-sm mb-3">Rating Distribution</h4>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count =
                    selectedVenue.reviewStats.distribution[star] || 0;
                  const total = selectedVenue.totalReviews || 1;
                  const percentage = (count / total) * 100;
                  return (
                    <div key={star} className="flex items-center gap-2 mb-1">
                      <span className="text-xs w-8">{star} ★</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Review Form */}
            <div className="mb-6">
              <h4 className="font-bold text-sm mb-3">
                {userReview ? "Your Review" : "Write a Review"}
              </h4>
              <ReviewForm
                restaurantId={selectedVenue.id}
                existingReview={userReview}
                onReviewSubmitted={handleReviewSubmitted}
                onClose={() => setShowReviewModal(false)}
              />
            </div>

            {/* Reviews List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm">All Reviews</h4>
                {reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-orange-500 text-sm font-semibold flex items-center gap-1"
                  >
                    {showAllReviews ? "Show Less" : "Show All"}
                    {showAllReviews ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                )}
              </div>
              <ReviewList
                reviews={showAllReviews ? reviews : reviews.slice(0, 3)}
                loading={reviewsLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Venues;

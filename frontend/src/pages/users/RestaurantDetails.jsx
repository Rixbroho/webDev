import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Users,
  Loader2,
  Calendar,
  Utensils,
  MessageSquare,
  ChevronLeft,
  Clock,
  Phone,
  Mail,
  Globe,
  DollarSign,
  Wifi,
  Car,
  Coffee,
  PawPrint,
  PartyPopper,
  MapPinned,
  ExternalLink,
  Building2,
  Flame,
  Snowflake,
} from "lucide-react";
import { toast } from "react-toastify";
import Nav from "../components/Nav";
import ReviewList from "../components/ReviewList";
import {
  getRestaurantById,
  createBooking,
  getRestaurantBookings,
  getRestaurantReviews,
} from "../../services/api";

const RestaurantDetails = ({ user, onLogout, setCurrentPage }) => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Booking states
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    guests: "2",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState([]);

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

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getRestaurantById(id);
        if (response.data.success) {
          setRestaurant(response.data.venue);
        } else {
          setError("Restaurant not found");
        }
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const reviewsRes = await getRestaurantReviews(id);
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.reviews || []);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) {
      fetchRestaurantData();
      fetchReviews();
    }
  }, [id]);

  const handleDateChange = async (e) => {
    const today = new Date();
    const selectedDate = new Date(e.target.value);
    if (selectedDate <= today.setHours(0, 0, 0, 0)) {
      toast.error("Cannot select past date");
      return;
    }
    setBookingData({ ...bookingData, date: e.target.value, time: "" });
    try {
      const res = await getRestaurantBookings(id, e.target.value);
      if (res.data.success)
        setUnavailableSlots(res.data.bookings.map((b) => b.time));
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingData.date || !bookingData.time || !bookingData.guests) {
      toast.error("Please fill all booking details");
      return;
    }
    setBookingLoading(true);
    try {
      const response = await createBooking({
        restaurantId: id,
        restaurantName: restaurant.name,
        location: restaurant.location,
        cuisine: restaurant.type || restaurant.cuisine,
        date: bookingData.date,
        time: bookingData.time,
        guests: bookingData.guests,
        priceRange: restaurant.price,
        price: restaurant.price,
      });
      if (response.data.success) {
        toast.success("Table reserved successfully!");
        setBookingData({ date: "", time: "", guests: "2" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      wifi: Wifi,
      parking: Car,
      coffee: Coffee,
      pets: PawPrint,
      events: PartyPopper,
      ac: Snowflake,
      heater: Flame,
      outdoor: MapPin,
    };
    return iconMap[amenity?.toLowerCase()] || Star;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <Nav
          activeTab="Restaurants"
          setActiveTab={() => {}}
          onLogout={onLogout}
        />
        <main className="flex-1 flex flex-col md:ml-64">
          <div className="flex-1 flex items-center justify-center pt-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-black uppercase">
                Loading Restaurant...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <Nav
          activeTab="Restaurants"
          setActiveTab={() => {}}
          onLogout={onLogout}
        />
        <main className="flex-1 flex flex-col md:ml-64">
          <div className="flex-1 flex items-center justify-center pt-20">
            <div className="text-center">
              <Utensils size={64} className="text-slate-200 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-slate-600 mb-2">
                {error || "Restaurant Not Found"}
              </h3>
              <Link
                to="/dashboard"
                className="inline-block mt-4 px-6 py-3 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans">
      <Nav
        activeTab="Restaurants"
        setActiveTab={(tab) => setCurrentPage(tab.toLowerCase())}
        onLogout={onLogout}
      />

      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-8 md:left-64 z-40">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-600 hover:text-orange-500 transition-colors"
          >
            <ChevronLeft size={24} />
            <span className="font-semibold">Back to Restaurants</span>
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto pt-20">
          <div className="max-w-7xl mx-auto p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Side - 70% */}
              <div className="lg:w-[70%] space-y-8">
                {/* Hero Image */}
                <div className="relative h-64 md:h-96 rounded-[2.5rem] overflow-hidden shadow-lg">
                  {restaurant.image?.startsWith("/uploads") ? (
                    <img
                      src={`http://localhost:3000${restaurant.image}`}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center text-8xl">
                      {restaurant.image || "🍽️"}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {restaurant.type && (
                        <span className="px-4 py-1.5 bg-orange-500 text-white rounded-full text-xs font-black uppercase">
                          {restaurant.type}
                        </span>
                      )}
                      {restaurant.cuisines?.map((cuisine, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tight">
                      {restaurant.name}
                    </h1>
                  </div>
                </div>

                {/* Location & Rating */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={20} className="text-orange-500" />
                    <span className="font-semibold">{restaurant.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderStars(restaurant.averageRating || 0)}
                    </div>
                    <span className="font-black text-slate-800">
                      {restaurant.averageRating?.toFixed(1) || "New"}
                    </span>
                    <span className="text-slate-400">
                      ({restaurant.totalReviews || 0} reviews)
                    </span>
                  </div>
                  {restaurant.price && (
                    <div className="px-4 py-1.5 bg-orange-100 rounded-full">
                      <span className="font-black text-orange-600">
                        {restaurant.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {restaurant.description && (
                  <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-800 mb-4 uppercase italic">
                      About
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {restaurant.description}
                    </p>
                  </div>
                )}

                {/* Price Details Section */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-slate-800 mb-6 uppercase italic">
                    Price & Dining
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Price Range */}
                    <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl">
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <DollarSign size={24} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">
                          Price Range
                        </p>
                        <p className="text-lg font-black text-slate-800">
                          {restaurant.price || restaurant.priceRange || "$$"}
                        </p>
                      </div>
                    </div>

                    {/* Cost per Person */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="p-3 bg-slate-200 rounded-xl">
                        <Utensils size={24} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">
                          Avg. Cost/Person
                        </p>
                        <p className="text-lg font-black text-slate-800">
                          {restaurant.averageCost ||
                            restaurant.avgCost ||
                            "₹500"}
                        </p>
                      </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="p-3 bg-slate-200 rounded-xl">
                        <Clock size={24} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">
                          Opening Hours
                        </p>
                        <p className="text-lg font-black text-slate-800">
                          {restaurant.openingHours || "11:00 AM - 10:00 PM"}
                        </p>
                      </div>
                    </div>

                    {/* Seating Capacity */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="p-3 bg-slate-200 rounded-xl">
                        <Users size={24} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">
                          Seating Capacity
                        </p>
                        <p className="text-lg font-black text-slate-800">
                          {restaurant.seatingCapacity || "50"} Guests
                        </p>
                      </div>
                    </div>

                    {/* City */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="p-3 bg-slate-200 rounded-xl">
                        <Building2 size={24} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">
                          City
                        </p>
                        <p className="text-lg font-black text-slate-800">
                          {restaurant.city || "New Delhi"}
                        </p>
                      </div>
                    </div>

                    {/* Area */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="p-3 bg-slate-200 rounded-xl">
                        <MapPinned size={24} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">
                          Area
                        </p>
                        <p className="text-lg font-black text-slate-800">
                          {restaurant.area || restaurant.location || "Central"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {(restaurant.amenities || restaurant.features) && (
                  <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-800 mb-6 uppercase italic">
                      Amenities & Features
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(restaurant.amenities || restaurant.features || []).map(
                        (amenity, idx) => {
                          const Icon = getAmenityIcon(amenity);
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm font-semibold text-slate-600"
                            >
                              <Icon size={16} className="text-orange-500" />
                              {amenity}
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}

                {/* Map Section */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-slate-800 mb-6 uppercase italic">
                    Location & Map
                  </h3>

                  {/* Address */}
                  <div className="flex items-start gap-4 mb-6 p-4 bg-orange-50 rounded-2xl">
                    <MapPin size={24} className="text-orange-500 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {restaurant.address || restaurant.location}
                      </p>
                      <p className="text-sm text-slate-500">
                        {restaurant.area}, {restaurant.city}
                      </p>
                      {restaurant.latitude && restaurant.longitude && (
                        <p className="text-xs text-slate-400 mt-2">
                          Coordinates: {restaurant.latitude},{" "}
                          {restaurant.longitude}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Map */}
                  <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-slate-100">
                    {restaurant.latitude && restaurant.longitude ? (
                      <iframe
                        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${restaurant.longitude}!3d${restaurant.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM1KwMDUnMDAuMCJTIDM1wrAwNic0NC42Ilc!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <div className="text-center">
                          <MapPinned
                            size={48}
                            className="text-slate-300 mx-auto mb-4"
                          />
                          <p className="text-slate-500 font-semibold">
                            Map view unavailable
                          </p>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.location || "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600"
                          >
                            Open in Google Maps
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Get Directions */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.location || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-slate-800 text-white rounded-2xl font-black text-sm uppercase hover:bg-slate-700"
                  >
                    <MapPin size={18} />
                    Get Directions
                  </a>
                </div>

                {/* Contact Info */}
                {(restaurant.phone ||
                  restaurant.email ||
                  restaurant.website) && (
                  <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-800 mb-4 uppercase italic">
                      Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {restaurant.phone && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <Phone size={18} className="text-orange-500" />
                          <span>{restaurant.phone}</span>
                        </div>
                      )}
                      {restaurant.email && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <Mail size={18} className="text-orange-500" />
                          <span>{restaurant.email}</span>
                        </div>
                      )}
                      {restaurant.website && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <Globe size={18} className="text-orange-500" />
                          <span>{restaurant.website}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Reviews Section */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare size={24} className="text-orange-500" />
                    <h3 className="text-xl font-black text-slate-800 uppercase italic">
                      Reviews
                    </h3>
                    <span className="text-slate-400 font-semibold">
                      ({reviews.length})
                    </span>
                  </div>
                  <ReviewList reviews={reviews} loading={reviewsLoading} />
                </div>
              </div>

              {/* Right Side - 30% (Booking Sidebar) */}
              <div className="lg:w-[30%]">
                <div className="sticky top-24 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar size={24} className="text-orange-500" />
                    <h3 className="text-xl font-black text-slate-800 uppercase italic">
                      Book a Table
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* Date Picker */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                        Select Date
                      </label>
                      <div className="flex items-center bg-slate-50 rounded-xl px-4 border-2 border-slate-100 focus-within:border-orange-500">
                        <Calendar size={18} className="text-orange-500" />
                        <input
                          type="date"
                          value={bookingData.date}
                          onChange={handleDateChange}
                          className="w-full p-3 bg-transparent outline-none font-semibold text-slate-700"
                        />
                      </div>
                    </div>

                    {/* Time Picker */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                        Select Time
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
                            className={`py-2 rounded-lg text-xs font-bold ${bookingData.time === time ? "bg-orange-500 text-white" : unavailableSlots.includes(time) ? "bg-slate-100 text-slate-300 line-through cursor-not-allowed" : "bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-600"}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                        Number of Guests
                      </label>
                      <div className="flex items-center bg-slate-50 rounded-xl px-4 border-2 border-slate-100 focus-within:border-orange-500">
                        <Users size={18} className="text-orange-500" />
                        <select
                          value={bookingData.guests}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guests: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-transparent outline-none font-semibold text-slate-700"
                        >
                          {[...Array(20)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i === 0 ? "Guest" : "Guests"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={handleConfirmBooking}
                      disabled={
                        bookingLoading || !bookingData.date || !bookingData.time
                      }
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-black text-sm uppercase shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        "Confirm Reservation"
                      )}
                    </button>

                    <p className="text-xs text-slate-400 text-center">
                      Free cancellation up to 24 hours before
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDetails;

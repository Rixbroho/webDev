import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Star,
  Users,
  Clock,
  AlertCircle,
  Loader2,
  X,
  Calendar,
  Utensils,
} from "lucide-react";
import { toast } from "react-toastify";
import Nav from "../components/Nav";
import {
  getAllRestaurants,
  createBooking,
  getRestaurantBookings,
} from "../../services/api";

const Restaurants = ({ user, onLogout, setCurrentPage }) => {
  const [activeNavTab, setActiveNavTab] = useState("Restaurants");
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    guests: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState([]);

  const handleNavTabChange = (tab) => {
    setActiveNavTab(tab);
    setCurrentPage(tab.toLowerCase());
  };

  // Fetch restaurants from the backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await getAllRestaurants();
        if (response.data.success) {
          setRestaurants(response.data.restaurants);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        toast.error("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleOpenBookingModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setBookingData({ date: "", time: "", guests: "" });
    setUnavailableSlots([]);
    setIsModalOpen(true);
  };

  const handleDateChange = async (e) => {
    const today = new Date();
    const selectedDate = new Date(e.target.value);

    // Ensure the selected date is strictly in the future
    if (selectedDate <= today.setHours(0, 0, 0, 0)) {
      toast.error("You cannot select a past or today's date.");
      return;
    }

    const dateValue = e.target.value;
    setBookingData({ ...bookingData, date: dateValue });

    // Fetch existing bookings for this restaurant & date and mark their time slots as unavailable
    try {
      if (selectedRestaurant?.id) {
        const res = await getRestaurantBookings(
          selectedRestaurant.id,
          dateValue,
        );
        if (res.data.success) {
          setUnavailableSlots(res.data.bookings.map((b) => b.time));
        } else {
          setUnavailableSlots([]);
        }
      }
    } catch (err) {
      console.error("Error fetching booked slots:", err);
      setUnavailableSlots([]);
    }
  };

  const predefinedTimeSlots = [
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "05:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM",
    "08:00 PM - 09:00 PM",
    "09:00 PM - 10:00 PM",
  ];

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setBookingData({ ...bookingData, time: selectedTime });
  };

  const handleConfirmBooking = async () => {
    if (!bookingData.date || !bookingData.time || !bookingData.guests) {
      toast.warning("Please fill in all fields");
      return;
    }

    try {
      setBookingLoading(true);
      const payload = {
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name,
        location: selectedRestaurant.location,
        cuisine: selectedRestaurant.cuisine,
        priceRange: selectedRestaurant.priceRange,
        date: bookingData.date,
        time: bookingData.time,
        guests: parseInt(bookingData.guests),
      };

      const response = await createBooking(payload);
      if (response.data.success) {
        toast.success("Table reserved successfully! Awaiting confirmation.");
        setIsModalOpen(false);
        setBookingData({ date: "", time: "", guests: "" });
      }
    } catch (error) {
      console.error("Booking error:", error);
      if (error.response?.status === 409) {
        toast.warning(
          error.response?.data?.message || "Selected time slot already booked",
        );
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create reservation",
        );
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] font-sans">
      {/* Navigation Sidebar */}
      <Nav
        activeTab={activeNavTab}
        setActiveTab={handleNavTabChange}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 md:left-64 z-40 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
            Discover <span className="text-orange-500">Restaurants</span>
          </h2>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:bg-white outline-none w-72 text-sm font-bold transition-all"
              />
            </div>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none mb-1">
                  {user?.username || "Guest"}
                </p>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                  {user?.role || "Foodie"}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl shadow-lg shadow-orange-100 flex items-center justify-center text-white font-black text-lg">
                {user?.username
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Restaurants Content */}
        <div className="flex-1 overflow-y-auto p-10 pt-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-6" />
              <p className="text-slate-500 font-black uppercase text-sm tracking-widest">
                Loading restaurants...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 overflow-hidden hover:-translate-y-1 group"
                  >
                    {/* Header */}
                    <div
                      className={`h-48 flex items-center justify-center overflow-hidden ${
                        restaurant.availability === "Available"
                          ? "bg-orange-50"
                          : "bg-amber-50"
                      }`}
                    >
                      {restaurant.image &&
                      restaurant.image.startsWith("/uploads") ? (
                        <img
                          src={`http://localhost:3000${restaurant.image}`}
                          alt={restaurant.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="text-7xl">
                          {restaurant.image || "🍽️"}
                        </div>
                      )}
                    </div>

                    <div className="p-8">
                      {/* Title and Rating */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="max-w-[70%]">
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight truncate group-hover:text-orange-600 transition-colors">
                            {restaurant.name}
                          </h3>
                          <p className="text-sm text-slate-500 font-medium">
                            {restaurant.cuisine}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-2xl">
                          <Star
                            size={16}
                            className="text-amber-500 fill-amber-500"
                          />
                          <span className="text-sm font-black text-amber-700">
                            {restaurant.rating || "5.0"}
                          </span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-3 mb-6 text-slate-700 h-12">
                        <MapPin
                          size={18}
                          className="text-orange-500 mt-1 flex-shrink-0"
                        />
                        <p className="text-sm font-medium line-clamp-2">
                          {restaurant.location}
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-3 mb-6 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-3 text-slate-600">
                          <Phone size={16} className="text-orange-500" />
                          <p className="text-sm font-medium">
                            {restaurant.phone || "Contact via App"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <Mail size={16} className="text-orange-500" />
                          <p className="text-sm font-medium">
                            {restaurant.email || "No email listed"}
                          </p>
                        </div>
                      </div>

                      {/* Price Range and Availability */}
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-2xl font-black text-orange-600">
                          {restaurant.priceRange}
                        </span>
                        <span
                          className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                            restaurant.availability === "Available"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {restaurant.availability === "Available" ? "✓" : "⏱"}
                          {restaurant.availability}
                        </span>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleOpenBookingModal(restaurant)}
                        className="w-full px-8 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-[1.5rem] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all font-black uppercase text-sm tracking-widest active:scale-95"
                      >
                        Reserve Table
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRestaurants.length === 0 && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <Utensils size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">
                    No Restaurants Found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search criteria or check back later.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {isModalOpen && selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-emerald-500 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Reserve Table</h3>
                <p className="text-emerald-100 text-sm">
                  {selectedRestaurant.name}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-emerald-600 p-1 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Date Input */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase block mb-2">
                  Select Date
                </label>
                <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <Calendar size={18} className="text-emerald-500" />
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-3 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Time Input */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase block mb-2">
                  Select Time
                </label>
                <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <Clock size={18} className="text-emerald-500" />
                  <select
                    value={bookingData.time}
                    onChange={handleTimeChange}
                    disabled={!bookingData.date}
                    className={`w-full p-3 bg-transparent outline-none text-gray-700 text-sm ${
                      !bookingData.date ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select a time slot
                    </option>
                    {predefinedTimeSlots.map((slot) => {
                      const isBooked = unavailableSlots.includes(slot);
                      return (
                        <option key={slot} value={slot} disabled={isBooked}>
                          {slot}
                          {isBooked ? " (Booked)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {!bookingData.date && (
                  <p className="text-xs text-red-500 mt-1">
                    Please select a date first.
                  </p>
                )}
              </div>

              {/* Guests Input */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase block mb-2">
                  Number of Guests
                </label>
                <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <Users size={18} className="text-emerald-500" />
                  <input
                    type="number"
                    min="1"
                    placeholder="2"
                    value={bookingData.guests}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        guests: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Booking Info */}
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <p className="text-sm text-emerald-800">
                  <span className="font-bold">Price Range:</span>{" "}
                  {selectedRestaurant.priceRange}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                  className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Reserving...
                    </>
                  ) : (
                    "Confirm Reservation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;

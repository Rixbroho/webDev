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

  const handleNavTabChange = (tab) => {
    setActiveNavTab(tab);
    setCurrentPage(tab.toLowerCase());
  };

  // Fetch restaurants from the backend
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await getAllRestaurants();
        if (response.data.success) {
          setVenues(response.data.venues);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        toast.error("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleOpenBookingModal = (venue) => {
    setSelectedVenue(venue);
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
      if (selectedVenue?.id) {
        const res = await getRestaurantBookings(selectedVenue.id, dateValue);
        if (res.data.success) {
          const bookedSlots = res.data.bookings.map((b) => b.time);
          setUnavailableSlots(bookedSlots);
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingData.date || !bookingData.time || !bookingData.guests) {
      toast.error("Please fill in all booking details");
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
        toast.success("Reservation confirmed!");
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message || "Failed to make reservation",
      );
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
    (venue) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase()),
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
        </header>

        <div className="flex-1 overflow-y-auto p-10 pt-32">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
              size={24}
            />
            <input
              type="text"
              placeholder="Search restaurants by name, cuisine or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[2rem] text-lg outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-lg shadow-slate-100"
            />
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-6" />
              <p className="text-slate-500 font-black uppercase text-sm tracking-widest">
                Finding restaurants...
              </p>
            </div>
          ) : filteredVenues.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <Utensils size={64} className="text-slate-200 mb-6" />
              <h3 className="text-2xl font-black text-slate-600 mb-4 uppercase tracking-tighter">
                No Restaurants Found
              </h3>
              <p className="text-slate-500 font-medium max-w-md">
                We couldn't find any restaurants matching your search. Try
                different keywords!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVenues.map((venue) => (
                <div
                  key={venue.id}
                  className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {venue.image && venue.image.startsWith("/uploads") ? (
                      <img
                        src={`http://localhost:3000${venue.image}`}
                        alt={venue.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center text-8xl">
                        {venue.image || "🍽️"}
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-orange-600 uppercase tracking-wider shadow-sm">
                      {venue.type}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors">
                          {venue.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium mt-1">
                          <MapPin size={16} className="text-orange-500" />
                          <span>{venue.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                        <Star
                          size={14}
                          className="text-orange-500 fill-current"
                        />
                        <span className="text-sm font-black text-orange-600">
                          {venue.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-orange-600 font-black text-xl">
                          {venue.price}
                        </p>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          Price Range
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenBookingModal(venue)}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-105 transition-all"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md relative overflow-hidden">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} className="text-slate-400" />
            </button>

            <div className="mb-8">
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Reserve Table
              </h3>
              <p className="text-slate-500 font-medium">
                at{" "}
                <span className="text-orange-600 font-bold">
                  {selectedVenue.name}
                </span>
              </p>
            </div>

            <div className="space-y-6">
              {/* Date Input */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                  Select Date
                </label>
                <div className="flex items-center bg-slate-50 rounded-lg px-3 border border-slate-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
                  <Calendar size={18} className="text-orange-500" />
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={handleDateChange}
                    className="w-full p-3 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() =>
                        !unavailableSlots.includes(time) &&
                        setBookingData({ ...bookingData, time })
                      }
                      disabled={unavailableSlots.includes(time)}
                      className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                        bookingData.time === time
                          ? "bg-orange-500 text-white"
                          : unavailableSlots.includes(time)
                            ? "bg-slate-100 text-slate-300 cursor-not-allowed line-through"
                            : "bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {unavailableSlots.length > 0 && (
                  <p className="text-xs text-slate-400 mt-2">
                    Some time slots are already booked
                  </p>
                )}
              </div>

              {/* Guests Input */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                  Number of Guests
                </label>
                <div className="flex items-center bg-slate-50 rounded-lg px-3 border border-slate-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
                  <Users size={18} className="text-orange-500" />
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
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-orange-800">
                  <span className="font-bold">Price Range:</span>{" "}
                  {selectedVenue.price}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

export default Venues;

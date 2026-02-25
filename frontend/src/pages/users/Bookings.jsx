import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Utensils,
} from "lucide-react";
import { toast } from "react-toastify";
import Nav from "../components/Nav";
import { getUserBookings } from "../../services/api";

const Bookings = ({ user, onLogout, setCurrentPage }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getUserBookings();
        if (response.data.success) {
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getFilteredBookings = () => {
    if (activeTab === "all") return bookings;
    if (activeTab === "pending")
      return bookings.filter((b) => b.status === "Pending");
    if (activeTab === "confirmed")
      return bookings.filter((b) => b.status === "Confirmed");
    return bookings;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <AlertCircle size={20} className="text-amber-500" />;
      case "Confirmed":
        return <CheckCircle2 size={20} className="text-emerald-500" />;
      case "Declined":
        return <XCircle size={20} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Declined":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] font-sans">
      {/* Navigation Sidebar */}
      <Nav
        activeTab="Bookings"
        setActiveTab={(tab) => {
          setCurrentPage(tab.toLowerCase());
        }}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 md:left-64 z-40 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
            My <span className="text-orange-500">Reservations</span>
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

        {/* Bookings Content */}
        <div className="flex-1 overflow-y-auto p-10 pt-32">
          {/* Tabs */}
          <div className="flex gap-2 mb-10 border-b border-slate-100">
            {["all", "pending", "confirmed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${
                  activeTab === tab
                    ? "text-orange-600 border-orange-500"
                    : "text-slate-400 border-transparent hover:text-orange-500"
                }`}
              >
                {tab === "all" && `All (${bookings.length})`}
                {tab === "pending" &&
                  `Pending (${bookings.filter((b) => b.status === "Pending").length})`}
                {tab === "confirmed" &&
                  `Confirmed (${bookings.filter((b) => b.status === "Confirmed").length})`}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-6" />
              <p className="text-slate-500 font-black uppercase text-sm tracking-widest">
                Loading reservations...
              </p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <Utensils size={64} className="text-slate-200 mb-6" />
              <h3 className="text-2xl font-black text-slate-600 mb-4 uppercase tracking-tighter">
                {activeTab === "all"
                  ? "No Reservations Yet"
                  : `No ${activeTab} reservations`}
              </h3>
              <p className="text-slate-500 font-medium">
                {activeTab === "all"
                  ? "Browse restaurants and make your first reservation!"
                  : `You don't have any ${activeTab} reservations.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="p-10">
                    {/* Header with Status */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                          {booking.restaurantName || booking.venueName}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">
                          {booking.cuisine || booking.type}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-3 px-4 py-2 rounded-2xl border font-black text-[10px] uppercase tracking-widest ${getStatusColor(
                          booking.status,
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        <span>{booking.status}</span>
                      </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-6 border-b border-slate-50">
                      {/* Date */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                          <Calendar size={20} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            DATE
                          </p>
                          <p className="font-black text-slate-900 text-sm">
                            {new Date(booking.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-2xl">
                          <Clock size={20} className="text-purple-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            TIME
                          </p>
                          <p className="font-black text-slate-900 text-sm">
                            {booking.time}
                          </p>
                        </div>
                      </div>

                      {/* Guests */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl">
                          <Users size={20} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            GUESTS
                          </p>
                          <p className="font-black text-slate-900 text-sm">
                            {booking.guests || booking.players || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          PRICE
                        </p>
                        <p className="font-black text-orange-600 text-xl">
                          {booking.priceRange || booking.price || "$$"}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <MapPin
                        size={20}
                        className="text-orange-500 mt-1 flex-shrink-0"
                      />
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          LOCATION
                        </p>
                        <p className="text-slate-900 font-bold">
                          {booking.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Bookings;

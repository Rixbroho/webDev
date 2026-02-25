import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Plus,
  Clock,
  ChevronRight,
  Utensils,
  Calendar,
  MapPin,
  Activity,
} from "lucide-react";
import Nav from "../components/Nav";
import { getDashboardStats, getUserBookings } from "../../services/api";

const UserDashboard = ({
  user = { username: "Guest", role: "Foodie" },
  onLogout,
  setCurrentPage,
}) => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const displayUser = {
    username: user?.username || "Guest",
    role: user?.role || "Foodie",
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(tab.toLowerCase());
  };

  // --- FETCHING LOGIC ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await getDashboardStats();
        if (response.data.success) {
          const backendStats = response.data.stats.map((stat) => ({
            label: stat.label,
            value: stat.value,
            icon:
              stat.icon === "Calendar"
                ? Calendar
                : stat.icon === "MapPin"
                  ? MapPin
                  : stat.icon === "Clock"
                    ? Clock
                    : Utensils,
            color: stat.color,
            bg: stat.bg,
          }));
          setStats(backendStats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const response = await getUserBookings();
        if (response.data.success) {
          setUpcomingBookings(response.data.bookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);
  // --- END OF LOGIC ---

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Nav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onLogout={onLogout}
      />

      <main className="flex-1 flex flex-col md:ml-64">
        {/* Modern White Header */}
        <header className="fixed top-0 right-0 left-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 md:left-64 z-40">
          <div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase italic">
              {activeTab} <span className="text-orange-500">Overview</span>
            </h2>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search restaurants..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white outline-none w-60 text-sm transition-all"
              />
            </div>

            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-5 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                  {displayUser.username}
                </p>
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                  {displayUser.role}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl shadow-lg shadow-orange-100 flex items-center justify-center text-white font-black">
                {displayUser.username[0]}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 pt-28 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingStats
              ? [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-28 bg-white animate-pulse rounded-3xl border border-gray-100"
                  />
                ))
              : stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow"
                  >
                    <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-black text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bookings Table */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tight">
                  Upcoming Reservations
                </h3>
                <button
                  onClick={() => handleTabChange("Bookings")}
                  className="text-orange-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View All <ChevronRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      <th className="px-8 py-4 text-left">Restaurant</th>
                      <th className="px-8 py-4 text-left">Schedule</th>
                      <th className="px-8 py-4 text-left">Status</th>
                      <th className="px-8 py-4 text-right">Guests</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loadingBookings ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-20 text-center text-gray-400 font-bold italic"
                        >
                          Syncing with database...
                        </td>
                      </tr>
                    ) : upcomingBookings.length > 0 ? (
                      upcomingBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="group hover:bg-orange-50/30 transition-colors"
                        >
                          <td className="px-8 py-6">
                            <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {booking.restaurantName || booking.venueName}
                            </div>
                            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                              ID: {booking.id}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-sm font-bold text-gray-800">
                              {booking.date}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.time}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span
                              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                booking.status === "Confirmed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right font-black text-gray-900">
                            {booking.guests || booking.players || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-20 text-center text-gray-400 font-bold italic"
                        >
                          No reservations found in database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              {/* New Feature: Dining Tips */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <Utensils
                    className="text-orange-500 animate-pulse"
                    size={24}
                  />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Dining Tips
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">
                    🍽️
                  </span>
                  <span className="text-sm font-bold text-orange-500 uppercase">
                    Bon Appétit
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  Discover amazing dining experiences at top restaurants near you!
                </p>
              </div>

              {/* Action Card */}
              <div className="bg-gradient-to-br from-orange-500 to-rose-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-orange-100 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-2 italic uppercase tracking-tighter">
                    Ready to Dine?
                  </h3>
                  <p className="text-orange-100 text-xs font-medium mb-8 leading-relaxed">
                    Find and reserve tables at the best restaurants in your area.
                  </p>
                  <button
                    onClick={() => handleTabChange("Restaurants")}
                    className="w-full bg-white text-orange-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-orange-50 transition-all active:scale-95"
                  >
                    <Plus size={18} className="inline mr-2" strokeWidth={3} />{" "}
                    New Reservation
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;

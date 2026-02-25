import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  Utensils,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
} from "../../services/api";

const UserBookingSetting = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Determine admin status :  `user` object, fall back to decoding the JWT token .
  const getRoleFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = token.split(".")[1];
      if (!payload) return null;
      const decoded = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
      );
      return decoded.role || null;
    } catch (e) {
      return null;
    }
  };

  const tokenRole = getRoleFromToken();
  const isAdmin =
    (currentUser?.role || tokenRole || "").toString().toLowerCase() === "admin";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        // Decide which endpoint to call based on logged-in user role
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        const response = isAdmin
          ? await getAllBookings()
          : await getUserBookings();

        if (response?.data?.success) {
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        const status = error?.response?.status;
        if (status === 403) {
          toast.error(
            "Access denied: admin privileges required to view all reservations.",
          );
        } else if (status === 401) {
          toast.error("Unauthorized. Please log in.");
        } else {
          toast.error("Failed to load reservations");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!isAdmin) {
      toast.error(
        "Access denied: admin privileges required to update reservation status.",
      );
      return;
    }

    try {
      setUpdating(bookingId);
      const response = await updateBookingStatus(bookingId, newStatus);
      if (response?.data?.success) {
        setBookings(
          bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: newStatus }
              : booking,
          ),
        );
        toast.success(`Reservation ${newStatus.toLowerCase()}!`);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      const status = error?.response?.status;
      if (status === 403) {
        toast.error("Access denied: admin privileges required.");
      } else if (status === 401) {
        toast.error("Unauthorized. Please log in.");
      } else {
        toast.error("Failed to update reservation");
      }
    } finally {
      setUpdating(null);
    }
  };

  const getFilteredBookings = () => {
    if (filterStatus === "all") return bookings;
    const capitalizedStatus =
      filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1);
    return bookings.filter((b) => b.status === capitalizedStatus);
  };

  const filteredBookings = getFilteredBookings();

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Declined":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="w-full">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b mb-6 overflow-x-auto">
        {["all", "pending", "confirmed", "declined"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-3 font-semibold transition-all capitalize border-b-2 whitespace-nowrap ${
              filterStatus === status
                ? "text-blue-600 border-blue-500"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {status === "all" && `All (${bookings.length})`}
            {status === "pending" &&
              `Pending (${bookings.filter((b) => b.status === "Pending").length})`}
            {status === "confirmed" &&
              `Confirmed (${bookings.filter((b) => b.status === "Confirmed").length})`}
            {status === "declined" &&
              `Declined (${bookings.filter((b) => b.status === "Declined").length})`}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading reservations...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <Utensils size={64} className="text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold text-gray-600 mb-2">
            No {filterStatus !== "all" ? filterStatus : ""} Reservations
          </h3>
          <p className="text-gray-500">
            {filterStatus === "all"
              ? "No reservations available"
              : `No ${filterStatus} reservations at the moment`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      {booking.restaurantName || booking.venueName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Booked by:{" "}
                      <span className="font-semibold">{booking.userName}</span>
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(
                      booking.status,
                    )}`}
                  >
                    {booking.status === "Confirmed" && (
                      <CheckCircle size={16} />
                    )}
                    {booking.status === "Declined" && <XCircle size={16} />}
                    {booking.status === "Pending" && <AlertCircle size={16} />}
                    {booking.status}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-100">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Calendar size={18} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        DATE
                      </p>
                      <p className="font-bold text-gray-800">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Clock size={18} className="text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        TIME
                      </p>
                      <p className="font-bold text-gray-800">{booking.time}</p>
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Users size={18} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        GUESTS
                      </p>
                      <p className="font-bold text-gray-800">
                        {booking.guests || booking.players || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">PRICE</p>
                    <p className="font-bold text-blue-600 text-lg">
                      {booking.priceRange || booking.price || "$$"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 mb-4">
                  <MapPin
                    size={18}
                    className="text-gray-400 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      LOCATION
                    </p>
                    <p className="text-gray-700">{booking.location}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {booking.status === "Pending" && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() =>
                        handleStatusUpdate(booking.id, "Confirmed")
                      }
                      disabled={updating === booking.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      {updating === booking.id ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, "Declined")}
                      disabled={updating === booking.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      {updating === booking.id ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Declining...
                        </>
                      ) : (
                        <>
                          <XCircle size={18} />
                          Decline
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingSetting;

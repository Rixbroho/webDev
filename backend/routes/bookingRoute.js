 const router = require("express").Router();
const bookingController = require("../controllers/bookingController");
const authGuard = require("../helpers/authguagrd"); // Fixed filename match
const isAdmin = require("../helpers/isAdmin");

// User routes
router.post("/booking", authGuard, bookingController.createBooking);
router.get("/booking/user", authGuard, bookingController.getUserBookings);

// Get bookings for a specific restaurant & date (used by frontend to disable booked time slots)
router.get(
  "/booking/restaurant",
  authGuard,
  bookingController.getBookingsForRestaurant,
);

// Keep old route for backward compatibility
router.get("/booking/venue", authGuard, bookingController.getBookingsForVenue);

// Admin routes
router.get("/booking", authGuard, isAdmin, bookingController.getAllBookings);
router.put(
  "/booking/:id/status",
  authGuard,
  isAdmin,
  bookingController.updateBookingStatus,
);
router.get(
  "/dashboard/stats",
  authGuard,
  isAdmin,
  bookingController.getDashboardStats,
);

module.exports = router;

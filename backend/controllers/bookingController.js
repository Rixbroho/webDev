const Booking = require("../models/bookingModel");
const User = require("../models/usermodel");
const { sendBookingConfirmedEmail } = require("../helpers/emailService");

exports.createBooking = async (req, res) => {
  try {
    // Log this to your terminal to see what's actually inside your token
    console.log("Token Data:", req.user);

    // Prevent double-booking: check if the same restaurant/date/time already exists
    const { restaurantId, date, time } = req.body;
    const existing = await Booking.findOne({
      where: { restaurantId, date, time },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Selected time slot is already booked for this restaurant.",
      });
    }

    const newBooking = await Booking.create({
      ...req.body,
      userId: req.user.id,
      // Fallback logic: if username is missing from token, use "User" or email
      userName: req.user.username || req.user.email || "Guest User",
      status: "Pending",
    });

    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    console.error("Booking Create Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Return bookings for a specific restaurant on a specific date (used to show unavailable time slots)
exports.getBookingsForRestaurant = async (req, res) => {
  try {
    const { restaurantId, date } = req.query;
    if (!restaurantId || !date) {
      return res
        .status(400)
        .json({
          success: false,
          message: "restaurantId and date are required",
        });
    }

    const bookings = await Booking.findAll({ where: { restaurantId, date } });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Keep alias for backward compatibility
exports.getBookingsForVenue = exports.getBookingsForRestaurant;

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find existing booking
    const booking = await Booking.findByPk(id);
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    // Update status
    await Booking.update({ status }, { where: { id } });

    // Fetch updated booking
    const updatedBooking = await Booking.findByPk(id);

    // Track whether email was sent and related info
    let emailSent = false;
    let emailAttempts = 0;
    let emailError = null;

    // If booking is confirmed, notify the booking owner (customer) by email
    if (status === "Confirmed") {
      try {
        // Fetch the booking's user to get their email
        const bookingUser = await User.findByPk(updatedBooking.userId);
        const recipientEmail = bookingUser?.email;
        const recipientName =
          bookingUser?.username ||
          updatedBooking.userName ||
          bookingUser?.email ||
          "Customer";

        if (recipientEmail) {
          try {
            const result = await sendBookingConfirmedEmail(
              recipientEmail,
              updatedBooking,
              recipientName,
            );
            emailSent = !!result.success;
            emailAttempts = result.attempts || 0;
            emailError = result.error || null;
            console.log(
              `Booking confirmation email ${emailSent ? "sent" : "failed"} to ${recipientEmail}`,
              result,
            );
          } catch (err) {
            console.error(
              "Unexpected error sending booking confirmation email to user:",
              err && err.message ? err.message : err,
            );
            emailError = (err && err.message) || String(err);
          }
        } else {
          console.warn(
            "Booking user email not found; skipping confirmation email",
          );
        }
      } catch (err) {
        console.error(
          "Error fetching booking user for confirmation email:",
          err && err.message ? err.message : err,
        );
      }
    }

    res.json({
      success: true,
      message: `Booking ${status}`,
      emailSent,
      emailAttempts,
      emailError,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const { sequelize } = require("../database/db");
    const { Op } = require("sequelize");

    // Get total bookings
    const totalBookings = await Booking.count();

    // Get bookings today (created on current date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookingsToday = await Booking.count({
      where: {
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
    });

    // Get pending bookings
    const pendingBookings = await Booking.count({
      where: { status: "Pending" },
    });

    // Calculate total revenue from confirmed bookings
    const confirmedBookings = await Booking.findAll({
      where: { status: "Confirmed" },
      raw: true,
    });

    const totalRevenue = confirmedBookings.reduce((sum, booking) => {
      const price = parseInt(booking.price?.replace(/[^\d]/g, "") || 0);
      return sum + price;
    }, 0);

    res.json({
      success: true,
      stats: {
        totalBookings,
        bookingsToday,
        pendingBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

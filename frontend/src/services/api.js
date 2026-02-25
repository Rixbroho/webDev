import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Auth API calls
export const signupUser = (userData) =>
  API.post("/user/user", {
    username: userData.fullName,
    email: userData.email,
    password: userData.password,
    phoneNumber: userData.phone,
  });

export const loginUser = (credentials) =>
  API.post("/user/loginuser", {
    email: credentials.email,
    password: credentials.password,
  });

export const forgotPassword = (email) =>
  API.post("/user/forgotpassword", {
    email,
  });

export const verifyOtp = (email, otp) =>
  API.post("/user/verifyotp", {
    email,
    otp,
  });

export const resetPassword = (email, otp, newPassword) =>
  API.post("/user/resetpassword", {
    email,
    otp,
    password: newPassword,
  });

export const getMe = () => API.get("/user/me");

// Admin Settings API calls
export const updateUserProfile = (userId, userData) =>
  API.put(`/user/updateuserbyid/${userId}`, userData);

export const getSettings = () => API.get("/admin/settings");
export const updateSettings = (settings) =>
  API.put("/admin/settings", settings);

export const getAllUsers = () => API.get("/user/getalluser");

export const getUserById = (userId) => API.get(`/user/getusersbyid/${userId}`);

export const deleteUser = (userId) =>
  API.delete(`/user/deleteuserbyid/${userId}`);

// Restaurant/Venue API calls - using /venue endpoint but with restaurant terminology
// The backend still uses /venue route but we're treating venues as restaurants
export const createRestaurant = (restaurantData) => {
  // Check if restaurantData is FormData (contains file)
  if (restaurantData instanceof FormData) {
    return API.post("/venue", restaurantData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.post("/venue", restaurantData);
};

// Keep venue functions for backward compatibility
export const createVenue = createRestaurant;

export const updateRestaurant = (id, restaurantData) => {
  if (restaurantData instanceof FormData) {
    return API.put(`/venue/${id}`, restaurantData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.put(`/venue/${id}`, restaurantData);
};

// Keep venue functions for backward compatibility
export const updateVenue = updateRestaurant;

export const deleteRestaurant = (id) => API.delete(`/venue/${id}`);

// Keep for backward compatibility
export const deleteVenue = deleteRestaurant;

export const getAllRestaurants = () => API.get("/venue");

// Keep for backward compatibility
export const getAllVenues = getAllRestaurants;

// Get bookings for a specific restaurant on a date (for time slot availability)
export const getRestaurantBookings = (restaurantId, date) =>
  API.get("/booking/restaurant", { params: { restaurantId, date } });

// Keep for backward compatibility
export const getVenueBookings = getRestaurantBookings;

// Booking API calls
export const createBooking = (bookingData) => API.post("/booking", bookingData);

export const getUserBookings = () => API.get("/booking/user");

export const getAllBookings = () => API.get("/booking");

export const changePassword = (currentPasswordOrObj, newPassword) => {
  if (typeof currentPasswordOrObj === "object") {
    const { currentPassword, newPassword: np } = currentPasswordOrObj;
    return API.post("/user/changepassword", {
      currentPassword,
      newPassword: np,
    });
  }
  return API.post("/user/changepassword", {
    currentPassword: currentPasswordOrObj,
    newPassword,
  });
};

export const updateBookingStatus = (id, status) =>
  API.put(`/booking/${id}/status`, { status });

// Dashboard stats API
export const getDashboardStats = () => API.get("/dashboard/stats");

export default API;

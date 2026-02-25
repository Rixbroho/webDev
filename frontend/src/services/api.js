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

// Restaurant API calls (recommended)
export const createRestaurant = (restaurantData) => {
  if (restaurantData instanceof FormData) {
    return API.post("/restaurant", restaurantData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.post("/restaurant", restaurantData);
};

export const updateRestaurant = (id, restaurantData) => {
  if (restaurantData instanceof FormData) {
    return API.put(`/restaurant/${id}`, restaurantData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.put(`/restaurant/${id}`, restaurantData);
};

export const deleteRestaurant = (id) => API.delete(`/restaurant/${id}`);

export const getAllRestaurants = () => API.get("/restaurant");

// Old Venue API calls (backward compatibility - still work)
export const createVenue = (venueData) => {
  if (venueData instanceof FormData) {
    return API.post("/venue", venueData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.post("/venue", venueData);
};

export const updateVenue = (id, venueData) => {
  if (venueData instanceof FormData) {
    return API.put(`/venue/${id}`, venueData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.put(`/venue/${id}`, venueData);
};

export const deleteVenue = (id) => API.delete(`/venue/${id}`);

export const getAllVenues = () => API.get("/venue");

// Booking API calls
export const createBooking = (bookingData) => API.post("/booking", bookingData);

export const getUserBookings = () => API.get("/booking/user");

export const getRestaurantBookings = (restaurantId, date) =>
  API.get("/booking/restaurant", { params: { restaurantId, date } });

// Keep old function name for backward compatibility
export const getVenueBookings = getRestaurantBookings;

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

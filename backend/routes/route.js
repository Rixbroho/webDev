const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  getAllUser,
  addUser,
  getUsersById,
  getActiveUsers,
  updateUser,
  deleteUser,
  logInUser,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
} = require("../controllers/userController");

const authGuard = require("../helpers/authguagrd");
const isAdmin = require("../helpers/isAdmin");

// Change password (authenticated)
router.post('/changepassword', authGuard, changePassword);

router.post("/user", upload.none(), addUser);
router.get("/me", authGuard, getMe);
router.post("/forgotpassword", forgotPassword);
router.post("/verifyotp", verifyOtp);
router.post("/resetpassword", resetPassword);
router.get("/getalluser", authGuard, isAdmin, getAllUser);
router.get("/getusersbyid/:id", authGuard, isAdmin, getUsersById);
router.get("/getactiveusers", authGuard, getActiveUsers);
// Allow authenticated users to update their own profile; controller will enforce permissions
router.put("/updateuserbyid/:id", authGuard, updateUser);
router.delete("/deleteuserbyid/:id", authGuard, isAdmin, deleteUser);
router.post("/loginuser", logInUser);

module.exports = router;

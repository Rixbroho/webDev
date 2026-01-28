import express from "express";
import multer from "multer";

import {
  getAllUser,
  addUser,
  getUsersById,
  getActiveUsers,
  updateUser,
  deleteUser,
  logInUser,
  getMe,
} from "../controllers/userController.js";

import authGuard from "../helpers/authGuard.js";
import isAdmin from "../helpers/isAdmin.js";

const router = express.Router();
const upload = multer();

router.get("/getallUsers", authGuard, isAdmin, getAllUser);
router.get("/getMe", authGuard, getMe);
router.get("/profile", authGuard, getMe); // Protected route using authGuard
router.post("/register", addUser);
router.get("/getuserByid/:uid", authGuard, isAdmin, getUsersById);
router.put("/updateUserByid/:id", authGuard, isAdmin, updateUser);
router.delete("/deleteuser/:id", authGuard, isAdmin, deleteUser);
router.post("/login", logInUser);

// express.post("/user",upload.none(),addUser)
// express.get("/me",authGuard,getMe)
// express.get("/getalluser",authGuard,isAdmin,getAllUser)
// express.get("/getusersbyid/:id",authGuard,isAdmin,getUsersById)
// express.get("/getactiveusers",authGuard,getActiveUsers)
// express.put("/updateuserbyid/:id",authGuard,isAdmin,updateUser)
// express.delete("/deleteuserbyid/:id",authGuard,isAdmin,deleteUser)
// express.post("/loginuser",logInUser)

export default router;

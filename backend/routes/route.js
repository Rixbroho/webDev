const express = require('express').Router();
const multer=require("multer");
const upload=multer();

const{addUser,getAllUser,getUsersById,getActiveUsers,updateUser,deleteUser,
    logInUser
}=require("../controllers/userController")

express.post("/user",upload.none(),addUser)
express.get("/getalluser",getAllUser)
express.get("/getusersbyid/:id",getUsersById)
express.get("/getactiveusers",getActiveUsers)
express.put("/updateuserbyid/:id",updateUser)
express.delete("/deleteuserbyid/:id",deleteUser)
express.post("/loginuser",logInUser)

module.exports=express;
const express = require('express').Router();

const{addUser,getAllUser,getUsersById,getActiveUsers,updateUser,deleteUser}=require("../controllers/userController")

express.post("/user",addUser)
express.get("/getalluser",getAllUser)
express.get("/getusersbyid/:id",getUsersById)
express.get("/getactiveusers",getActiveUsers)
express.put("/updateuserbyid/:id",updateUser)
express.delete("/deleteuserbyid/:id",deleteUser)


module.exports=express;
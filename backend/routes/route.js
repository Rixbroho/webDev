const express = require('express').Router();

const{addUser,getAllUser,getUsersById,getActiveUsers,updateUser}=require("../controllers/userController")

express.post("/user",addUser)
express.get("/getalluser",getAllUser)
express.get("/getusersbyid/:id",getUsersById)
express.get("/getactiveusers",getActiveUsers)
express.put("/updateuser",updateUser)


module.exports=express;
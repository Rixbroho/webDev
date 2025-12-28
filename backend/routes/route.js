const express = require('express').Router();

const{addUser,getAllUser,getUsersById,getActiveUsers,updateUser,deleteUser,
    logInUser
}=require("../controllers/userController")

express.post("/user",addUser)
express.get("/getalluser",getAllUser)
express.get("/getusersbyid/:id",getUsersById)
express.get("/getactiveusers",getActiveUsers)
express.put("/updateuserbyid/:id",updateUser)
express.delete("/deleteuserbyid/:id",deleteUser)
express.post("/loginuser",logInUser)

module.exports=express;
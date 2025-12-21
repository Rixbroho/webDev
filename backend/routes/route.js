const express = require('express').Router();

const{addUser,getAllUser}=require("../controllers/userController")

express.post("/user",addUser)
express.get("/getalluser",getAllUser)


module.exports=express;
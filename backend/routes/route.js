const express = require('express').Router();

const{addUser}=require("../controllers/userController")


// express.get("/getalluser",getAllUser)
express.post("/user",addUser)

module.exports=express;
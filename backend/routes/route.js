const express = require('express').Router();

const{addUser}=require("../controllers/userController")

express. post("/user",addUser)

module.exports=express;
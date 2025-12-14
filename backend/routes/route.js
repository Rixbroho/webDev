const express = require('express').Router();

const{getAllUser}=require("../controllers/userController")

express.get("/all",getAllUser)

module.exports=express;
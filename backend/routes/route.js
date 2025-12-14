const express = require('express').Router();

const{getAllUser}=require("../controllers/userController")

express.get("/getal",getAllUser)

module.exports=express;
const express = require('express').Router();

const{getAllProduct}=require("../controllers/productRoute")

express.get("/product",getAllProduct)

module.exports=express;
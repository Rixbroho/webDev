const User=require("../models/userModel.js")

const addUser=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const newUser=await User.create({
            username,
            email,
            password
        });

        res.status(201).json({
            message:"User created successfully",
            user:newUser
        });

    }catch(error){
        res.status(500).json({message:"Error creating user",error: error.message});
    }
}

module.exports={
addUser
}
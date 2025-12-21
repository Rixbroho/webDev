const User=require("../models/userModel.js")
const bcrypt=require("bcrypt");

const addUser=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const hassed = await bcrypt.hash(password,10);
        console.log(hassed);

        const newUser=await User.create({
            username,
            email,
            password: hassed
        });

        res.status(201).json({
            message:"User created successfully",
            user:newUser
        });

    }catch(error){
        res.status(500).json({message:"Error creating user",error: error.message});
    }
}

const getAllUser=async(req,res)=>{
    const users=await User.findAll();
    res.json({users,message:"This is the get all user"});
}

// const 

module.exports={
    getAllUser,addUser
}
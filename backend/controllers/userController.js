const User=require("../models/userModel.js")
const bcrypt=require("bcrypt");

const addUser=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const isUser = await User.findOne({where:{username}});
        const isemail = await User.findOne({where:{email}});
        if(isUser||isemail){
            return res.json({message:"User already exists"});
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
    try{
        const users=await User.findAll({attributes:{exclude:["password"]}});
        return res.json({users,message:"User fetched successfully"});        
    }catch(error){
        return res.status(500).json({message:"Error fetching users",error: error.message});
    }
}

const getUsersById=async(req,res)=>{
    try{
        const {id}=req.params.id;
        const user=await User.findByPk(id);
        return res.json({
            user:{id:user.id,username:user.username},
            message:"User fetched successfully"
        });
    }catch(error){
        return res.status(500).json({
            message:"Error fetching user",
            error: error.message
        });
    }
}

const getActiveUsers = async (req, res) => {
  res.json({ message: "Get active users - to be implemented" });
};


module.exports={
    getAllUser,addUser,getUsersById,getActiveUsers 
}
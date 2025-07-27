const User=require("../models/User.js");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const dotenv=require("dotenv");
const nodemailer=require("nodemailer");
const crypto=require("crypto");

dotenv.config();



const key=process.env.secretKey;

//register handler

const register=async(req,res)=>{
    const {userName,email,password}=req.body;
    try
    {
        let user= await User.findOne({email});
        if(user) return res.status(400).json({error:"User already exists"});
        const hashPassword=await bcrypt.hash(password,10)
        user=new User({
            userName,
            email,
            password:hashPassword});
        await user.save();
        res.status(201).json({message:"Registered successfully!"});
    }
    catch(err)
    {
        console.log("Error occured in reigster handler:",err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

//login handler

const login=async(req,res)=>{
    const {email,password}=req.body;
    try
    {
        let user=await User.findOne({email});
        if(!user) return res.status(404).json({message:"Email not found"});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid credentials"});
        const token=jwt.sign({id:user._id},key,{expiresIn:"1d"});
        console.log(user,token);
        res.status(200).json({
        message: "Login Successful!",
        token,         
        user: {
            id: user._id,
            email: user.email,
            userName: user.userName
        }
         });
    }
    catch(err)
    {
        console.log("Error in login handler:",err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

const getUsers=async(req,res)=>{
    try {
        const users=await User.find();
        if(!users) return res.json({message:"Empty Data"});
        res.json(users);
    } catch (error) {
        console.log("Error in getUsers handler:",error);
        res.status(500).json({error:"Internal Server Error"});
    }
}

//forgot password controller function



module.exports={register,login,getUsers,forgotPassword,resetPassword};
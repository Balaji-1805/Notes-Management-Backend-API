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
        if(user) return res.status(400).json({error:"Email already exists"});
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

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(200).json({ message: 'Invalid Email, Please Enter Valid Email' });

        let token;
        token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 1000 * 60 * 15;

        await user.save();

        const resetLink = `https://notes-management-frontend-ui.vercel.app/reset-password/${token}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS
            }
        });

        await transporter.sendMail({
            to: user.email,
            subject: "Password Reset Link",
            html: `<a href="${resetLink}">Click Here to reset your Password</a>`
        });

        console.log("Reset Link Sent");
        console.log(user.email);
        res.json({ message: "Reset link Sent",token });
    } 
    catch (err) {
        console.log("Error in Forgot Password controller:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//reset password
const resetPassword=async(req,res)=>{
    try
    {
        const {token}=req.params;
        const {newPassword}=req.body;
        const user=await User.findOne({
            resetToken:token,
            resetTokenExpiry:{$gt:Date.now()},//checks whether it is expired or not
        });
        if(!user) return res.status(400).json({error:"Invalid or Expired Token"});
        const updatePassword=await bcrypt.hash(newPassword,10);
        user.password=updatePassword;
        user.resetToken=undefined;
        user.resetTokenExpiry=undefined;
        await user.save();
        res.status(200).json({message:"Password reset successfully!"});
    }
    catch(err)
    {
        console.log("Error in reset password controller:",err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

module.exports={register,login,getUsers,forgotPassword,resetPassword};
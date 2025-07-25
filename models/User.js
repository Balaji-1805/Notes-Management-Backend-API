const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    userName:{
    type:String,
    required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    resetToken:String,
    resetTokenExpiry:Date,
    notes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Note",
        }
    ]
},{timestamps:true});

const User=mongoose.model('User',userSchema);

module.exports=User;
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config();
const secretKey=process.env.secretKey;
const protect=async (req,res,next)=>
{
    const token=req.headers.token;
    console.log(token);
    if(!token) return res.status(400).json({error:"Unauthorized access"});
    try {
       try
       {
        const decode=jwt.verify(token,secretKey);
        req.user=decode;
        console.log(req.user);
       }
       catch(err)
       {
        console.log("Error:",err);
        res.status(400).json({error:"Invalid Token"});
       }
        next();
    } catch (error) {
        console.log("Error occured:",error);
        res.status(500).json({error:"Internal Server Error"});
    }
}

module.exports=protect;
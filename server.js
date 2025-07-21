const express=require("express");
const dotenv=require("dotenv");
const connectDB=require("./config/db.js");
const userRoutes=require("./routes/userRoutes.js");
const noteRoutes=require("./routes/noteRoutes.js");
const bodyParser = require("body-parser");

const app=express();
dotenv.config();
const PORT=process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());


connectDB()
.then(()=>{
    console.log("MongoDB connected");
    app.listen(PORT,()=>{
        console.log(`Server is running at http://localhost:${PORT}`);
    });
})
.catch((err)=>{
    console.log("Connection Failed:",err);
})

app.use('/user',userRoutes);
app.use('/notes',noteRoutes);
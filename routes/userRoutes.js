const express=require("express");
const router=express.Router();
const userController=require("../controllers/userController.js");
const protect=require("../middlewares/verifyToken.js");

router.post("/register",userController.register);
router.post("/login",userController.login);
router.get("/getUsers",userController.getUsers);
router.post('/forgot-password',userController.forgotPassword);
router.post('/reset-password/:token',userController.resetPassword);
module.exports=router;
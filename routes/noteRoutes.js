const express=require('express');
const router=express.Router();
const protect=require("../middlewares/verifyToken.js");
const noteController=require("../controllers/noteController.js");

router.post("/addNote",protect,noteController.createNotes);
router.get("/getNotes",protect,noteController.getNotes);
router.get("/note/:id",protect,noteController.getNote);
router.put("/update/:id",protect,noteController.updateNotes);
router.delete("/delete/:id",protect,noteController.deleteNote);


module.exports=router;

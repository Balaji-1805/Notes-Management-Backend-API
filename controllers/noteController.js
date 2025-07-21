const Note=require("../models/Note.js");
const User=require("../models/User.js");

const createNotes=async(req,res)=>{
    const {title,description}=req.body;
    const userId=req.user.id;
    try
    {
        const note= new Note({title,description,user:userId});
        const savedNote=await note.save();
        console.log(savedNote);
        const user=await User.findById(userId);
        user.notes.push(savedNote._id);
        await user.save();
        console.log("Note added successfully");
        res.status(201).json(savedNote);
    }
    catch(err)
    {
        console.log("Error in createNote handler:",err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

const getNotes=async(req,res)=>{
    const userId=req.user.id;
    try
    {
        const user=await User.findById(userId);
        const noteData=user.notes;
        console.log(noteData);
        const notes=await Promise.all(
            user.notes.map(async(noteId)=>{
                return await Note.findById(noteId);
            })
        )

        res.status(200).json(notes);
    }
    catch(err)
    {
        console.log("Error in getNotes Handler:",err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

const updateNotes=async(req,res)=>{
    const noteId=req.params.id;
    const {title,description}=req.body;
    try
    {
        const updateNotes=await Note.findByIdAndUpdate(noteId,{title,description},{new:true});
        if(!updateNotes) return res.status(400).json({error:"Note Not Found"});
        res.status(200).json({message:"Note Updated Successfully",updateNotes});
    }
    catch(err)
    {
        console.log("Error in Note Update handler:",err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

const deleteNote=async(req,res)=>{
    const id=req.params.id;
    try
    {
        const note=await Note.findByIdAndDelete(id);
        if(!note) return res.status(404).json({error:"Note not found"});
        await User.findByIdAndUpdate(note.user,{
            $pull:{notes:id}
        });
        res.status(200).json({message:"Note Deleted Successfully!"});
    }
    catch(err)
    {
        console.log("Error in DeleteNote handler:",err);
        res.status(500).json({error:"Internal Server Error"});
    }
}

module.exports={createNotes,getNotes,updateNotes,deleteNote};
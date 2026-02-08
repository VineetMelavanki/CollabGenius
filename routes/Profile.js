const express=require('express');
const ProfileRouter=express.Router();
const {CreateProfile,ViewProfile}=require("../controllers/Profile");
const {authmiddleware}=require("../middleware/authmiddleware")
const {uploads} =require("../middleware/upload")
ProfileRouter.post("/Create-Profile",authmiddleware,uploads.single("photo"),CreateProfile);
ProfileRouter.get("/View-Profile",authmiddleware,ViewProfile);
module.exports=ProfileRouter;
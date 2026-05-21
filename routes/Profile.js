const express=require('express');
const ProfileRouter=express.Router();
const {CreateProfile,ViewProfile,getmyprofile,ViewprofileById,EditProfile}=require("../controllers/Profile");
const {authmiddleware}=require("../middleware/authmiddleware")
const {uploads} =require("../middleware/upload")
ProfileRouter.post("/Create-Profile",authmiddleware,uploads.single("photo"),CreateProfile);
ProfileRouter.get("/View-Profile",authmiddleware,ViewProfile);
ProfileRouter.get("/Get-me",authmiddleware,getmyprofile);
ProfileRouter.get("/view-profile/:id",authmiddleware,ViewprofileById);
ProfileRouter.post("/edit-profile",authmiddleware,EditProfile);
module.exports=ProfileRouter;
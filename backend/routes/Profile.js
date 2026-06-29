const express=require('express');
const ProfileRouter=express.Router();
const {CreateProfile,ViewProfile,getmyprofile,ViewprofileById,EditProfile,getprofilebyskills,getskills,getdomain}=require("../controllers/Profile");
const {authmiddleware}=require("../middleware/authmiddleware")
const {uploads} =require("../middleware/upload")
ProfileRouter.post("/Create-Profile",authmiddleware,uploads.single("photo"),CreateProfile);
ProfileRouter.get("/View-Profile",authmiddleware,ViewProfile);
ProfileRouter.get("/Get-me",authmiddleware,getmyprofile);
ProfileRouter.get("/view-profile/:id",authmiddleware,ViewprofileById);
ProfileRouter.post("/edit-profile",authmiddleware,uploads.none(),EditProfile);
ProfileRouter.get("/get-skills",authmiddleware,getskills);
ProfileRouter.get("/get-domains",authmiddleware,getdomain);
ProfileRouter.post("/get-profiles-by-skills/:userId",authmiddleware,getprofilebyskills);
module.exports=ProfileRouter;
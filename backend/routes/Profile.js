const express=require('express');
const ProfileRouter=express.Router();
const {CreateProfile,ViewProfile}=require("../controllers/Profile");
const {authmiddleware}=require("../middleware/authmiddleware")
ProfileRouter.post("/Create-Profile",authmiddleware,CreateProfile);
ProfileRouter.get("/View-Profile",authmiddleware,ViewProfile);
module.exports=ProfileRouter;
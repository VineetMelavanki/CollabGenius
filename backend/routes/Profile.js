const express=require('express');
const ProfileRouter=express.Router();
const {CreateProfile}=require("../controllers/Profile");
const {authmiddleware}=require("../middleware/authmiddleware")
ProfileRouter.post("/Create-Profile",authmiddleware,CreateProfile);

module.exports=ProfileRouter;
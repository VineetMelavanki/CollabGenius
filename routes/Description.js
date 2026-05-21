const express=require("express");
const{authmiddleware}=require("../middleware/authmiddleware")
const {createDescription}=require("../controllers/Description")
const DescriptionRouter=new express.Router();
DescriptionRouter.post("/create-Description/:projectId/:workId",authmiddleware,createDescription);

module.exports=DescriptionRouter;
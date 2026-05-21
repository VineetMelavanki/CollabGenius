const express=require("express");
const researchRouter=new express.Router();
const {arXivResearch}=require("../controllers/research")
const {authmiddleware} =require("../middleware/authmiddleware")
researchRouter.get("/search-topic",authmiddleware,arXivResearch);
module.exports=researchRouter;
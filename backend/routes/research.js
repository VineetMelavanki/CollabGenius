const express=require("express");
const researchRouter=new express.Router();
const {arXivResearch,githubResearch}=require("../controllers/research")
const {authmiddleware} =require("../middleware/authmiddleware")
researchRouter.get("/search-topic",authmiddleware,arXivResearch);
researchRouter.get("/github-search",authmiddleware,githubResearch);
module.exports=researchRouter;
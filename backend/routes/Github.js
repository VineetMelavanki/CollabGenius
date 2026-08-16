const express=require("express");
const githubRouter=new express.Router();
const{AddContributor}=require("../controllers/Github");
const {authmiddleware}=require("../middleware/authmiddleware")
githubRouter.post(`/add-contributor/:repoOwner/:repoName/:collaboratorUserName`,authmiddleware,AddContributor);

module.exports=githubRouter;
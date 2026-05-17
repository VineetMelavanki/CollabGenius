const express=require("express");
const AuthRouter=new express.Router();
const{GithubCallback} =require("../auth/github")
AuthRouter.get("/github/callback",GithubCallback);

module.exports=AuthRouter;
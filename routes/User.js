const express=require("express");
const { UserLogin,UserRegisteration,getuserbyId,getallusers,getuserByname,getme,logout}=require("../controllers/User");
const Userrouter =express.Router();
const{authmiddleware}=require("../middleware/authmiddleware")
const{validatelogin,validateregisteration}=require("../middleware/validator");
const{GoogleLogin}=require("../controllers/GoogleLogin");
const{GithubLogin}=require("../controllers/GithubLogin")
Userrouter.post("/register",validateregisteration,UserRegisteration)
Userrouter.post("/google-login",GoogleLogin);
Userrouter.get("/get-me",getme);
Userrouter.post("/logout",logout);
Userrouter.post("/login",validatelogin,UserLogin);
Userrouter.get("/allusers",authmiddleware,getallusers);
Userrouter.get("/search",authmiddleware,getuserByname);
Userrouter.get("/:UserId",authmiddleware,getuserbyId);
Userrouter.get("/github/login",GithubLogin);
module.exports=Userrouter;
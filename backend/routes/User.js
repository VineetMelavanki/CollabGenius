const express=require("express");
const { UserLogin,UserRegisteration,getuserbyId,getallusers,getuserByname,getme,logout,verifygithubaccesstoken,}=require("../controllers/User");
const Userrouter =express.Router();
const{authmiddleware}=require("../middleware/authmiddleware")
const{validatelogin,validateregisteration}=require("../middleware/validator");
const{GoogleLogin}=require("../controllers/GoogleLogin");
const{GithubLogin,CreateRepo,GetAllRepo,ConnectGithub}=require("../controllers/Github")

Userrouter.post("/register",validateregisteration,UserRegisteration)
Userrouter.post("/google-login",GoogleLogin);
Userrouter.get("/get-me",getme);
Userrouter.post("/logout",logout);
Userrouter.post("/login",validatelogin,UserLogin);
Userrouter.get("/allusers",authmiddleware,getallusers);
Userrouter.get("/search",authmiddleware,getuserByname);
Userrouter.get("/:UserId",authmiddleware,getuserbyId);
Userrouter.get("/github/login",GithubLogin);
Userrouter.get("/github/connect-github",authmiddleware,ConnectGithub);
Userrouter.post("/github/create-repo/:TeamId/:workId",authmiddleware,CreateRepo);
Userrouter.get("/github/get-repo/:TeamId/:workId",authmiddleware,GetAllRepo);
Userrouter.get("/github/verify-access-token/:userId",authmiddleware,verifygithubaccesstoken);
module.exports=Userrouter;
const express=require("express");
const { UserLogin,UserRegisteration,getuserbyId,getallusers}=require("../controllers/User");
const Userrouter =express.Router();
const{authmiddleware}=require("../middleware/authmiddleware")
const{validatelogin,validateregisteration}=require("../middleware/validator");

Userrouter.post("/register",validateregisteration,UserRegisteration)

Userrouter.post("/login",validatelogin,UserLogin);

Userrouter.get("/allusers",authmiddleware,getallusers);

Userrouter.get("/:UserId",authmiddleware,getuserbyId);

module.exports=Userrouter;
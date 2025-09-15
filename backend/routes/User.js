const express=require("express");
const { UserLogin,UserRegisteration}=require("../controllers/User");
const Userrouter =express.Router();
Userrouter.route("/register")
.post(UserRegisteration);
Userrouter.route("/login")
.post(UserLogin);

module.exports=Userrouter;
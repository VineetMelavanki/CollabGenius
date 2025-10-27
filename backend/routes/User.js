const express=require("express");
const { UserLogin,UserRegisteration,getuserbyId,getallusers}=require("../controllers/User");
const Userrouter =express.Router();
Userrouter.route("/register")
.post(UserRegisteration);
Userrouter.route("/login")
.post(UserLogin);
Userrouter.route("/UserId")
.get(getuserbyId);
Userrouter.route("/allusers")
.get(getallusers);
module.exports=Userrouter;
const express=require("express");
const { UserLogin,UserRegisteration,getuserbyId,getallusers}=require("../controllers/User");
const Userrouter =express.Router();
Userrouter.route("/register")
.post(UserRegisteration);
Userrouter.route("/login")
.post(UserLogin);
Userrouter.route("/allusers")
.get(getallusers);
Userrouter.route("/:UserId")
.get(getuserbyId);

module.exports=Userrouter;
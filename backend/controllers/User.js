const mongoose= require("mongoose");
const Team =require("../model/Team");
const User=require("../model/User");
const bcrypt =require("bcrypt");
const saltRounds= 10;
async function UserRegisteration(req,res)
{
    try{
    const {Name,email,password}=req.body;
    if(!Name || !email || !password)
    {
        return res.status(400).json({msg :"All fields are required"});
    }
    const hashpassword= await bcrypt.hash(password,saltRounds); 

    const existingemail=await User.findOne({email})
    if(existingemail)
    {
        return res.status(409).json({msg :"Email already exists"});
    }
    const result= await User.create({
        Name,
        email,
        password :hashpassword,
    });
    console.log("Result",result);
    return res.status(201).json({msg :"Successfully Registered", result});
}catch(error)
{
    console.log(error);
    return res.status(500).json({msg : "Internal server error ",success : false ,error : error.message });
}
}
async function UserLogin(req,res)
{
    try{
    const{email,password}=req.body;
    if(!email ||!password)
    {
        return res.status(400).json({msg :"All fields are required"});
    }

    const user1= await User.findOne({email})
    if(!user1)
    {
        return res.status(404).json({msg :"email not found"});
    }
    const Validpassword= await bcrypt.compare(password,user1.password);
    if(!Validpassword)
    {
        return res.status(400).json({msg:"Please enter a valid password"});
    }
    return res.status(200).json({status:"Successfull login"});
}catch(error)
{
    console.log(error);
    return res.status(500).json({msg : "Internal server error ", success : false, error : error.message});
}
}
async function getuserbyId(req,res)
{
    try{
    const{UserId}=req.params;
    const getUser = await User.findById(UserId);
    if(!getUser)
    {
        return res.status(404).json({msg : "User does not exists ",success : false});
    }
    return res.status(200).json({msg :"User found",data :getUser,success : true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg : "Internal server error ",success : false, error : error.message});
    }

}
async function getallusers(req,res)
{
    try{
        const getall=await User.find({});
        return res.status(200).json({msg :getall.length ? "Users exists" : "No user exists",data : getall, success : true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg : "Internal server error ",success : false , error : error.message});
    }
}
module.exports={UserLogin,UserRegisteration,getuserbyId,getallusers};
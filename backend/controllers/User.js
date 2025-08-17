const mongoose= require("mongoose");
const Team =require("../model/Team");
const User=require("../model/User");
const bcrypt =require("bcrypt");
const User = require("../model/User");
const saltRounds= 10;
async function UserRegisteration(req,res)
{
    const {Name,email,password}=req.body;
    if(!Name || !email || !password)
    {
        return res.status(400).json({msg :"All fields are required"});
    }
    const hashpassword= await bcrypt.hash(password,saltRounds); 

    const existingemail=await User.findOne({email})
    if(existingemail)
    {
        return res.status(400).json({msg :"Email already exists"});
    }
    const result= await User.create({
        Name,
        email,
        password :hashpassword,
    });
    console.log("Result",result);
    return res.status(201).json({msg :"Successfully Registered"});
}
async function UserLogin(req,res)
{
    const{Name,email,password}=req.body;
    if(!Name ||!email ||!password)
    {
        return res.status(400).json({msg :"All fields are required"});
    }

    const emailexists= await User.findOne({email})
    if(!emailexists)
    {
        return res.status(400).json({msg :"email not found"});
    }
    const User= await User.findone({Name});
    if(!User)
    {
        return res.status(401).json({msg:"User not found"});
    }
    const Validpassword= await bcrypt.compare(password,User.password);
    if(!Validpassword)
    {
        return res.status(400).json({msg:"Please enter a valid password"});
    }
    return res.status(200).json({status:"Successfull login"});
}
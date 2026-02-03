const User=require("../model/User");
const validateregisteration=(req,res,next)=>{
    const{name,email,password}=req.body;

    if(!name || !email || !password)
    {
        return res.status(400).json({msg:"All fields are required"});
    }
    next();
}
const validatelogin=(req,res,next)=>{
    const{email,password}=req.body;

    if(!email || !password)
    {
        return res.status(400).json({msg : "All fields required"});
    }
    next();
}

module.exports={validatelogin,validateregisteration};
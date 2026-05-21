const User=require("../model/User");
const jwt=require("jsonwebtoken");
const authmiddleware=async(req,res,next)=>{
    const token=req.cookies.token;
    if(!token)
    {
        return res.status(400).json({msg:"No token provided",success:false});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
       req.user=decoded;
       next();
    }
    catch(err)
    {
        return res.status(401).json({msg :"Invalid token"});
    }
};

module.exports={authmiddleware};
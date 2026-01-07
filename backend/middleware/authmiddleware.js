const User=require("../model/User");
const jwt=require("jsonwebtoken");
const authmiddleware=async(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    if(!token)
    {
        return res.status(400).json({msg:"No token provided"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_secret);
        const user=await User.findById(decoded.userId);

        if(!user)
        {
            return res.status(400).json({msg:"User not found"})
        }
       req.user=user;
       next();
    }
    catch(err)
    {
        return res.status(401).json({msg :"Invalid token"});
    }
};

module.exports={authmiddleware};
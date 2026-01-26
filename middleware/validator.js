const User=require("../model/User");
const Team=require("../model/Team");
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
const validateteamcreation=async (req,res,next)=>{
    try{
        const{name,member,roles}=req.body;
    const owner=req.user._id;
    if(!owner || !name)
    {
        return res.status(400).json({msg : "owner and name required"});
    }
    const Teamname= await Team.findOne({name});
    if(Teamname)
    {
        return res.status(409).json({msg : "Team already exists"});
    }
    const ownerexists= await User.findById(owner);
    if(ownerexists)
    {
        return res.status(409).json({msg : "Owner already exists"});
    }
    next();
    }
    catch(error)
    {
        console.log("Error in team validation : ",error.message);
        return res.status(500).json({msg:"Internal server error ",error:error.message});
    }
}
module.exports={validatelogin,validateregisteration,validateteamcreation};
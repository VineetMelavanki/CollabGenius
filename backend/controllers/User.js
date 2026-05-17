const User=require("../model/User");
const bcrypt =require("bcrypt");
const jwt=require("jsonwebtoken");
const saltRounds= 10;
async function UserRegisteration(req,res)
{
    try{
    const {name,email,password}=req.body;
    if(!name || !email || !password)
    {
        return res.status(400).json({msg :"All fields are required"});
    }
    const hashpassword= await bcrypt.hash(password,saltRounds); 

    const existingemail=await User.findOne({email});
    if(existingemail)
    {
        return res.status(409).json({msg :"Email already exists"});
    }
    const newUser= await User.create({
        name,
        email,
        password :hashpassword,
    });
    const token =await jwt.sign({id: newUser._id,name:newUser.name},process.env.JWT_SECRET,{expiresIn :"7d"});
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    console.log("Result",newUser);
    const userResponse = newUser.toObject();
    delete userResponse.password;
    return res.status(201).json({msg :"Successfully Registered", user: userResponse, success : true});
}catch(error)
{
    console.log(error);
    return res.status(500).json({msg : "Internal server error ",success : false ,error : error.message });
}
}
async function UserLogin(req,res)
{
    try{
    const{name ,email,password}=req.body;
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
    const token=jwt.sign(
        {id :user1._id, name:user1.name},
        process.env.JWT_SECRET,
        {expiresIn : "7d"}
    );
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    console.log("User logged in : ",user1);
    const userResponse = user1.toObject();
    delete userResponse.password;
    return res.status(200).json({status:"Successfull login",user:userResponse, success:true});
}catch(error)
{
    console.log(error);
    return res.status(500).json({msg : "Internal server error ", success : false, error : error.message});
}
}
async function getuserByname(req,res)
{
    try{
        const{name}=req.query;
        if(!name)
        {
            return res.status(409).json({msg:"Please enter a name",success:false});
        }
        const Users=await User.find({
            name:{$regex:name,$options:"i"}
        }).select("_id name email");
        if(Users.length===0)
        {
            return res.status(404).json({msg:"User does not exists",success:false});
        }
        return res.status(200).json({msg:"User exists",userdata:Users,success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
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
        return res.status(200).json({msg :getall.length ? "Users exists" : "No user exists",user : getall, success : true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg : "Internal server error ",success : false , error : error.message});
    }
}
async function getme(req,res)
{
    try{
       const token=req.cookies.token;
       if(!token)
       {
        return res.status(404).json({msg:"No authentication",success:false});
       }
       const decoded=jwt.verify(token,process.env.JWT_SECRET);
       const user=await User.findById(decoded.id).select("-password");
       if(!user)
       {
        return res.status(404).json({msg:"User does not exists",success:false});
       }
       return res.status(200).json({msg:"User authenticated successfully",user,success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}

async function logout(req,res)
{
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });
        return res.status(200).json({msg:"Logged out successfully",success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Logout failed",success:false});
    }
}

module.exports={UserLogin,UserRegisteration,getuserbyId,getallusers,getuserByname,getme,logout};
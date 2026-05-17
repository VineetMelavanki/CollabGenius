const axios=require("axios");
const User=require("../model/User")
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

async function GithubCallback(req,res)
{
    try{
     const{code,state}=req.query;

    if(!code)
    {
        return res.status(404).json({msg:"Code not found",success:false});
    }
    const tokenResponse=await axios.post(
        "https://github.com/login/oauth/access_token",
        {
            client_id:process.env.GITHUB_CLIENT_ID,
            client_secret:process.env.GITHUB_CLIENT_SECRET,
            code:code,
        },
        {
            headers:{
                Accept:"application/json",
            },
        }
    );

    const access_token=tokenResponse.data.access_token;

    if(!access_token)
    {
        return res.status(404).json({msg:"Failed to get access token",sucess:false});
    }
    const userResponse=await axios.get("https://api.github.com/user",{
        headers:{
            Authorization:`Bearer ${access_token}`,
        }
    });
    const githubUser=userResponse.data;
    const emailResponse=await axios.get(
        "https://api.github.com/user/emails",
        {
            headers:{
                Authorization:`Bearer ${access_token}`,
            },
        }
    );
    const primaryEmail=emailResponse.data.find((email)=>email.primary)?.email;
    let user=await User.findOne({email:primaryEmail});
    if(!user)
    {
       const randomPassword=await bcrypt.hash(Math.random().toString(36), 10);
       user=await User.create({
        name:githubUser.name || githubUser.login,
        email:primaryEmail,
        password:randomPassword,
       });
    }
    const token=jwt.sign({id:user._id.toString(), name:user.name},process.env.JWT_SECRET,{expiresIn:"7d"});
    res.cookie("token",token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.redirect("http://localhost:5173/dashboard");
    }catch(error)
    {
        console.log("Error : ",error);
        return res.status(500).json({msg:"OAuth failed",success:false});
    }

}
module.exports={GithubCallback};
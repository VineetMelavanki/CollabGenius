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

    if(!state)
    {
        return res.status(400).json({msg:"Missing state ",success:false});
    }

    let decodedState;
    try{
        decodedState=JSON.parse(Buffer.from(state,"base64url").toString());
    }catch{
        return res.status(400).json({msg:"Invalid state",success:false});
    }

    if(decodedState.nonce!==req.cookies?.github_oauth_state)
    {
        return res.status(400).json({msg:"State miss matched",success:false});
    }
    res.clearCookie("github_oauth_state");

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
    if(decodedState.userId)
    {
        const existingLink=await User.findOne({githubUsername:githubUser.login});
         if (existingLink && existingLink._id.toString() !== decodedState.userId) {
                return res.redirect("http://localhost:5173/HomeScreen");
            }
         await User.findByIdAndDelete(decodedState.userId,{
            githubaccess_token:access_token,
            githubUsername:githubUser.login,
         });

         return res.redirect("http://localhost:5173/HomeScreen");

    }
    let user=await User.findOne({email:primaryEmail});
    if(!user)
    {
       const randomPassword=await bcrypt.hash(Math.random().toString(36), 10);
       user=await User.create({
        name:githubUser.name || githubUser.login,
        email:primaryEmail,
        password:randomPassword,
        githubaccess_token:access_token
       });
    }else{
        user.githubaccess_token=access_token,
        await user.save();
    }
    const token=jwt.sign({id:user._id.toString(), name:user.name},process.env.JWT_SECRET,{expiresIn:"7d"});
    res.cookie("token",token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.redirect("http://localhost:5173/HomeScreen");
    }catch(error)
    {
        console.log("Error : ",error);
        return res.status(500).json({msg:"OAuth failed",success:false});
    }
}
module.exports={GithubCallback};
const {OAuth2Client}=require("google-auth-library");
const jwt=require("jsonwebtoken");
const User=require("../model/User");
const bcrypt=require("bcrypt");

const client=new OAuth2Client(
    "659066824406-8clgik6i16ef14pa8i920svco5m2l6vb.apps.googleusercontent.com"
);

async function GoogleLogin(req,res)
{
    try{
        const {token}=req.body;
        const ticket=await client.verifyIdToken({
            idToken:token,
            audience:"659066824406-8clgik6i16ef14pa8i920svco5m2l6vb.apps.googleusercontent.com"
        });
        const payload=ticket.getPayload();

        let user=await User.findOne({email:payload.email});

        if(!user)
        {
            const randomPassword=await bcrypt.hash(Math.random().toString(36), 10);
            user=await User.create({
                name:payload.name,
                email:payload.email,
                password:randomPassword
            });
            console.log("New user created via Google login:", user);
        }

        const jwtToken=jwt.sign(
            {id:user._id, name:user.name},
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const userResponse = user.toObject();
        delete userResponse.password;
        return res.status(200).json({msg:"Google login successful",user:userResponse,success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Google login failed"});
    }
}
module.exports={GoogleLogin};
const Profile=require("../model/Profile");
const cloudinary=require("cloudinary");
const User=require("../model/User");
async function CreateProfile(req,res){
    try{
      const{name,Bio,skills,skillevel,github_link}=req.body;
      if(!Bio || !skills || !skillevel || !github_link)
      {
        return res.status(401).json({msg:"All fields are required",success:false});
      }
      const nameexists=await User.findOne({user:req.user.id});
      if(nameexists)
      {
        return res.status(409).json({msg:"Name already exists",success:false});
      }
      if(req.file)
      {
        const uploadresults= await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder:"profile_photos",
        });
         photodata={
          url:uploadresults.secure_url,
          public_id:uploadresults.public_id,
         }
      }
      const profile=await Profile.create({
        name,
        Bio,
        skills,
        skillevel,
        github_link,
        photo:photodata,
      })
      return res.status(200).json({msg:"Profile created successfully",data:profile,success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function ViewProfile(req,res)
{
  try{
    const Profileexists=await Profile.findOne({name:req.user.id})
    if(!Profileexists)
    {
      return res.status(404).json({msg:"Profile not found",success:false});
    }
    return res.status(200).json({msg:"Profile found",success:true,Profile:Profileexists});

  }catch(error)
  {
     console.log(error);
     return res.status(500).json({msg:"Internal server error",success:false});
  }
}
module.exports={CreateProfile,ViewProfile};
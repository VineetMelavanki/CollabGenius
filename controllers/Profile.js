const Profile=require("../model/Profile");
const cloudinary=require("../config/cloudinary");
const User=require("../model/User");
async function CreateProfile(req,res){
   console.log("CREATE PROFILE REQ.USER:", req.user)
    try{
      const{name,Bio,skills,skillevel,github_link}=req.body;
      if(!name || !Bio || !skills || !skillevel || !github_link)
      {
        return res.status(400).json({msg:"All fields are required",success:false});
      }
      let photodata=null;
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
        userId:req.user.id,
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
    const Profileexists=await Profile.findOne({userId:req.user.id})
    
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
async function ViewprofileById(req,res) {
    try{
      const Profilexists=await Profile.findOne({userId:req.params.id})
      .populate("photo","url");
      if(!Profilexists)
      {
        return res.status(404).json({msg:"Profile not found",success:false});
      }
      return res.status(200).json({msg:"Profile found successfully",Profile:Profilexists,success:true});
    }catch(error)
    {
      console.log(error);
      return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function getmyprofile(req,res)
{
  try{
     const profile=await Profile.findOne({userId:req.user.id});
  if(!profile)
  {
    return res.status(404).json({hasprofile:false});
  }
  return res.status(200).json({hasprofile:true});
  }catch(error)
  {
    console.log(error);
    return res.status(500).json({msg:"Internal server error",success:false});
  }
}
async function EditProfile(req,res)
{
  try{
    const{name,Bio,skills,skillevel,github_link}=req.body;
  const profile=await Profile.findOne({userId:req.user.id});
  if(!profile)
  {
    return res.status(404).json({msg:"Profile not found",success:false});
  }
  if(!name || !Bio  || !skillevel ||!skills ||  !github_link)
  {
    return res.status(409).json({msg:"Field cannot be blank",success:false});
  }
  profile.name=name,
  profile.Bio=Bio,
  profile.skills=skills,
  profile.github_link=github_link,
  await profile.save();
  return res.status(200).json({msg:"Profile saved successfully",newprofile:profile,success:true});
  }catch(error)
  {
    return res.status(500).json({msg:"Internal server error",success:false});
  }
}
module.exports={CreateProfile,ViewProfile,getmyprofile,ViewprofileById,EditProfile};
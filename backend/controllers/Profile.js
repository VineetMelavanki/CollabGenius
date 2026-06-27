const Profile=require("../model/Profile");
const cloudinary=require("../config/cloudinary");
const User=require("../model/User");
async function CreateProfile(req,res){
   console.log("CREATE PROFILE REQ.USER:", req.user)
    try{
      let{name,Bio,skills,skillevel,github_link,domains}=req.body;
      skills=JSON.parse(skills || "[]");
      domains=JSON.parse(domains || "[]");
      if(!name || !Bio || skills.length==0 || !skillevel || !github_link || domains.length==0)
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
        skills:skills || [],
        skillevel,
        github_link,
        domains:domains ||[],
        photo:photodata,
      });
      
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
    return res.status(200).json({hasprofile:false});
  }
  return res.status(200).json({hasprofile:true});
  }catch(error)
  {
    console.log(error);
    return res.status(500).json({msg:"Internal server error",success:false});
  }
}
async function getskills(req,res)
{
  try{
     const skills=Profile.schema.path("skills").caster.enumValues;
     
     return res.status(200).json({msg:"Skills fecthed successfully",skills:skills,success:true});
  }catch(error)
  {
    return res.status(500).json({msg:"Internal server error",success:false});
  }
}
async function getdomain(req,res)
{
  try{
      const domains=Profile.schema.path("domains").caster.enumValues;
     
      return res.status(200).json({msg:"Domains fetched successfully",domains:domains,success:true});
  }catch(error)
  {
    return res.status(500).json({msg:"Internal server error",success:false});
  }
}
async function EditProfile(req,res)
{
  try{
    let{name,Bio,skills,skillevel,github_link,domains}=req.body;
    skills=JSON.parse(skills || "[]");
  const profile=await Profile.findOne({userId:req.user.id});
  if(!profile)
  {
    return res.status(404).json({msg:"Profile not found",success:false});
  }
  if(!name || !Bio  || !skillevel || skills.length==0 ||  !github_link)
  {
    return res.status(409).json({msg:"Field cannot be blank",success:false});
  }
        if (name) profile.name = name;
        if (Bio) profile.Bio = Bio;
        if (skills.length>0) profile.skills=skills;
        if (skillevel) profile.skillevel = skillevel;
        if (github_link) profile.github_link = github_link;
        if (domains !== undefined) profile.domains = Array.isArray(domains) ? domains : [];
  await profile.save();
  return res.status(200).json({msg:"Profile saved successfully",newprofile:profile,success:true});
  }catch(error)
  {
    console.log("Error name : ",error.name);
    console.log("Error message : ",error.message);
    return res.status(500).json({msg:"Internal server error",success:false});
  }
}
async function getprofilebyskills(req,res)
{
  try{
     const {skills}=req.body;
     if(skills.length==0)
     {
      return res.status(200).json({msg:"No inputs provided",success:true});
     }
     const allProfiles=await Profile.find({
       skills:{$in :skills}
     });
     if(allProfiles.length==0)
     {
      return res.status(200).json({msg:"No profiles found",Profiles:[],success:true});
     }
     return res.status(200).json({msg:"Profiles fetched successsfully",Profiles:allProfiles,success:true});
     }catch(error)
     {
      return res.status(500).json({msg:"Internal server error",success:false});
     }
}

module.exports={CreateProfile,ViewProfile,getmyprofile,ViewprofileById,EditProfile,getprofilebyskills,getskills,getdomain};
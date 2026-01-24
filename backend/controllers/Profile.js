const Profile=require("../model/Profile");
const User=require("../model/User");
async function CreateProfile(req,res){
    try{
      const{Bio,skills,skillevel,github_link}=req.body;
      if(!Bio || !skills || !skillevel || !github_link)
      {
        return res.status(401).json({msg:"All fields are required",success:false});
      }
      const nameexists=await User.findOne({email});
      if(nameexists)
      {
        return res.status(409).json({msg:"Name already exists",success:false});
      }
      const Profile=await Profile.create({
        name:req.user.id,
        Bio,
        skills,
        skillevel,
        github_link,
      });
      return res.status(200).json({msg:"Profile created successfully",data:Profile,success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
module.exports={CreateProfile};
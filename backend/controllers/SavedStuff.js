const SavedRepo=require("../model/SavedRepo");
const SavedDocs=require("../model/SaveDocs");
const User=require("../model/User");
const Team = require("../model/Team");
async function SaveGithubRepo(req,res)
{
    try{
        const{TeamId,workId}=req.params;
       const{name,html_url}=req.body;
       if(!name || !html_url)
       {
        return res.status(400).json({msg:"All repository information needed",success:false});
       }
      
       const nameexists=await SavedRepo.findOne({name:name,TeamId});
       if(nameexists)
       {
        return res.status(409).json({msg:"Repository is already saved",success:false});
       }
       const NewSavedRepo=await SavedRepo.create({
        name:name,
        TeamId:TeamId,
        workId:workId,
        repourl:html_url,
        savedby:req.user.id,
       });
       return res.status(201).json({msg:"Repository saved successfully",repository:NewSavedRepo,success:true});
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function fetchAllsavedRepos(req,res)
{
    try{
     const{TeamId,workId}=req.params;

     const GithubRepos=await SavedRepo.find({TeamId:TeamId,workId:workId}).populate("savedby","name email");

     if(GithubRepos.length===0)
     {
        return res.status(200).json({msg:"No Saved repositories found",success:false});
     }
     return res.status(200).json({msg:"All Repos fetched successfully",Repos:GithubRepos,success:true});
    }catch(error)
    {
      console.log(error);
      return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function DeletesavedRepos(req,res)
{
    try{
        const{repoId,TeamId,workId}=req.params;
        const user=await User.findById(req.user.id);
        const GithubRepo=await SavedRepo.findById(repoId);
        if(!GithubRepo)
        {
            return res.status(404).json({msg:"Github repo does not exists",success:false});
        }
        const Teamexists=await Team.findById(TeamId);
        if(!Teamexists)
        {
            return res.status(404).json({msg:"Team does not exists",success:false});
        }
        const ownerId=Teamexists?.ownerId;
        if(user._id.toString()!== ownerId.toString())
            {
                return res.status(401).json({msg:"Only Team Leaders can delete the saved Repositories",success:false});
            }
        await SavedRepo.findByIdAndDelete(repoId);
        
        return res.status(200).json({msg:"Saved repository deleted successfully",success:true});
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
module.exports={SaveGithubRepo,fetchAllsavedRepos,DeletesavedRepos};
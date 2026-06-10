const SavedRepo=require("../model/SavedRepo");
const SavedDocs=require("../model/SaveDocs");
const User=require("../model/User");
async function SaveGithubRepo(req,res)
{
    try{
        const{projectId,workId}=req.params;
       const{name,html_url}=req.body;
       if(!name || !html_url)
       {
        return res.status(400).json({msg:"All repository information needed",success:false});
       }
      
       const nameexists=await SavedRepo.findOne({name:name,projectId});
       if(nameexists)
       {
        return res.status(409).json({msg:"Repository is already saved",success:false});
       }
       const NewSavedRepo=await SavedRepo.create({
        name:name,
        projectId:projectId,
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
     const{projectId,workId}=req.params;

     const GithubRepos=await SavedRepo.find({projectId:projectId,workId:workId}).populate("savedby","name email");

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
module.exports={SaveGithubRepo,fetchAllsavedRepos};
const RepoNotes=require("../model/RepoNotes");
const Team=require("../model/Team");
const Work=require("../model/Work");
const SavedRepo=require("../model/SavedRepo");
async function CreateGithubRepoNotes(req,res)
{
    try{
       const {repoId}=req.params;
       const{description}=req.body;
       if(!description)
       {
        return res.status(409).json({msg:"Please enter your notes",success:false});
       }
       
       const saveRepo=await SavedRepo.findById(repoId);
       if(!saveRepo)
       {
        return res.status(404).json({msg:"No such saved respository found",success:false});
       }
       const Notes=await RepoNotes.create({
        repoId:repoId,
        description:description,
        author:req.user.id,
       });
       return res.status(201).json({msg:"Notes Added successfully",Notes:Notes,success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function getallnotes(req,res)
{
    try{
       const{repoId}=req.params;
       const Notes=await RepoNotes.find({repoId:repoId}).populate("author","name email");
       if(Notes.length==0)
       {
        return res.status(201).json({msg:"No notes available",success:false});
       }
       return res.status(200).json({msg:"Notes fetched successfully",Notes:Notes,success:true});
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
module.exports={CreateGithubRepoNotes,getallnotes};
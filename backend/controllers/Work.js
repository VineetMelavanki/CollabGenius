const Work=require("../model/Work");
const Team=require("../model/Team");
const User=require("../model/User");
async function CreateWork(req,res)
{
    try{
    const{TeamId}=req.params;
    const {name}=req.body;
    if(!name)
    {
        return res.status(409).json({msg:"Please enter the Team name",success:false});
    }
   
    const ownerId=req.user.id;
    if(!TeamId)
    {
        return res.status(404).json({msg:"No Team found",success:false});
    }
    const isOwner=await Team.findOne({
        _id:TeamId,
        ownerId:ownerId});
    if(!isOwner)
    {
        return res.status(400).json({msg:"Only owner can create Team",success:false});
    }
    const newWork=await Work.create({
        name,
        members:[ownerId],
        owner:ownerId,
        Team:TeamId,
    });
    return res.status(201).json({msg:"Team created successfully",Team:newWork,success:true});
    }catch(error)
    {
       return res.status(500).json({msg:"Internal server error ",success:false});
    } 
}
async function getWork(req,res)
{
    try{
       const {TeamId}=req.params;
    if(!TeamId)
    {
        return res.status(404).json({msg:"Team does not exists",success:false});
    }
    const works=await Work.find({Team:TeamId})
   
    if(works.length===0)
    {
        return res.status(400).json({msg:"No Team found",Team:[],success:false});
    }
    return res.status(200).json({msg:"All Teams fetched",Team:works,success:true});
    }catch(error)
    {
       return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function getWorkById(req,res)
{
    try{
     const {workId}=req.params;
     const workexists=await Work.findById(workId);

     if(!workexists)
     {
        return res.status(404).json({msg:"No Team by this name exists",success:false});
     }
     return res.status(200).json({msg:"Team fetched successfully",Team:workexists,success:true});
    }catch(error)
    {
       return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function deletework(req,res)
{
    try{
     const{TeamId,workId}=req.params;
     if(!TeamId)
     {
        return res.status(404).json({msg:"Team not found",success:false});
     }
     if(!workId)
     {
        return res.status(404).json({msg:"Team  not found"});
     }
     const deleted=await Work.findOneAndDelete({
        _id:workId,
        Team:TeamId,
     })
     if(!deleted)
     {
        return res.status(400).json({msg:"Team cannot be deleted",success:false});
     }
     return res.status(200).json({msg:"Team deleted successfully",success:true});
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function getworkbyMember(req,res)
{
    try{
       const{userId}=req.params;
       const userexist=await User.findById(userId);
       if(!userexist)
       {
        return res.status(404).json({msg:"User does not exists",success:false});
       }
       const allworks={};
       const allTeams=[];
       const Teams=await Team.find({members:userId}).populate("title");
       await Promise.all(
        Teams.map(async(Team)=>{
        const works=await Work.find({Team:Team._id}).populate("name");
        if(works.length>0)
        {
          allworks[Team._id]=works;
          allTeams.push(Team._id);
        }
       })
       );
       return res.status(200).json({msg:"All works fetched sucessfully",allworks:allworks,allTeams:allTeams,success:true});
    }catch(error)
    {
        console.log("The error is : ",error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
module.exports={CreateWork,getWork,deletework,getWorkById,getworkbyMember};
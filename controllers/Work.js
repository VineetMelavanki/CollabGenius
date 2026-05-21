const Work=require("../model/Work");
const Project=require("../model/project");
async function CreateWork(req,res)
{
    try{
    const{projectId}=req.params;
    const {name}=req.body;
    if(!name)
    {
        return res.status(409).json({msg:"Please enter the project name",success:false});
    }
   
    const ownerId=req.user.id;
    if(!projectId)
    {
        return res.status(404).json({msg:"No project found",success:false});
    }
    const isOwner=await Project.findOne({
        _id:projectId,
        ownerId:ownerId});
    if(!isOwner)
    {
        return res.status(400).json({msg:"Only owner can create project",success:false});
    }
    const newWork=await Work.create({
        name,
        owner:ownerId,
        project:projectId,
    });
    return res.status(201).json({msg:"Project created successfully",Project:newWork,success:true});
    }catch(error)
    {
       return res.status(500).json({msg:"Internal server error ",success:false});
    } 
}
async function getWork(req,res)
{
    try{
       const {projectId}=req.params;
    if(!projectId)
    {
        return res.status(404).json({msg:"Team does not exists",success:false});
    }
    const works=await Work.find({project:projectId})
   
    if(works.length===0)
    {
        return res.status(400).json({msg:"No project found",project:[],success:false});
    }
    return res.status(200).json({msg:"All projects fetched",Project:works,success:true});
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
        return res.status(404).json({msg:"No project by this name exists",success:false});
     }
     return res.status(200).json({msg:"Project fetched successfully",Project:workexists,success:true});
    }catch(error)
    {
       return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function deletework(req,res)
{
    try{
     const{projectId,workId}=req.params;
     if(!projectId)
     {
        return res.status(404).json({msg:"Team not found",success:false});
     }
     if(!workId)
     {
        return res.status(404).json({msg:"Project  not found"});
     }
     const deleted=await Work.findOneAndDelete({
        _id:workId,
        project:projectId,
     })
     if(!deleted)
     {
        return res.status(400).json({msg:"Project cannot be deleted",success:false});
     }
     return res.status(200).json({msg:"Project deleted successfully",success:true});
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
module.exports={CreateWork,getWork,deletework,getWorkById};
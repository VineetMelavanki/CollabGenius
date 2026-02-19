const User=require("../model/User");
const Project=require("../model/project");
const Profile=require("../model/Profile");
async function CreateProject(req,res)
{
    console.log("The id of owner is : ",req.user.id)
    try{
    const{title,status ,createdAt, updatedate}=req.body;
    if(!title)
    {
        return res.status(400).json({msg : "All fields are required ", success : false});
    }
    const Titlexists = await Project.findOne({title});
    if(Titlexists)
    {
        return res.status(409).json({msg : "Project Title already exists ",success : false});
    }
    const Newproject= await Project.create({
        title,
        ownerId:req.user.id,
        status,
        createdAt,
        updatedate,
    });
    return res.status(201).json({msg : "Project created successfully",project: Newproject});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg :" Internal server error",success : false, error : error.message});
    }
}
async function Getallprojects(req,res)
{
    try{
        const allproject= await Project.find({});
        
        return res.status(200).json({success : true , msg : allproject.length ? "projects fetched successfully" : "Projects not found",projects: allproject});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg : "Internal server error ",success : false, error : error.message});
    }
}

async function getprojectbyId(req,res){
    try{
       const {id}=req.params;
       const projectinfo=await Project.findById(id);
       if(!projectinfo)
       {
        return res.status(404).json({msg:"Project Not found",success:false});
       }
       return res.status(200).json({msg:"Project found",projectdata:projectinfo,success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function deleteproject(req,res)
{
    try{
         const{id}=req.params;
         const deletedproject=await Project.findByIdAndDelete({
            _id:id,
            ownerId:req.user.id
         });
         if(!deletedproject)
         {
            return res.status(404).json({msg:"Project does not exists",success:false});
         }
         return res.status(200).json({msg:"Project deleted successfully",deletedproject,success:false,})
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
module.exports={CreateProject,Getallprojects,getprojectbyId,deleteproject};
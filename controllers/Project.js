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
        
        return res.status(200).json({success : true , msg : allproject.length ? "projects fetched successfully" : "Projects not found",data : allproject});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg : "Internal server error ",success : false, error : error.message});
    }
}
async function ViewProject(req,res){
    try{
        console.log("The owner id is :",req.user.id);
        const projectexists=await Project.findOne({ownerId:req.user.id});
        if(!projectexists)
        {
            return res.status(404).json({msg:"Project does not exists",success:false});
        }
        
        const ownerProfile=await Profile.findOne({userId:req.user.id});
        console.log("Populated project : ",projectexists);
        console.log("Owner profile : ",ownerProfile);
        
        const projectWithProfile={
            ...projectexists.toObject(),
            ownerProfile:ownerProfile
        }
        
        return res.status(200).json({msg:"Project Found",project:projectWithProfile,success:true});
    }catch(error)
    {
        console.log("ViewProject Error:", error);
        return res.status(500).json({msg:"Internal server error",error:error.message,success:false});
    }
}
module.exports={CreateProject,Getallprojects,ViewProject};
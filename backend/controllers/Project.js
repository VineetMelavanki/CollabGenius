const Team=require("../model/Team");
const User=require("../model/User");
const Project=require("../model/project");
async function CreateProject(req,res)
{
    try{
    const{title,teamid, ownerId , status ,createdAt, updatedate}=req.body;
    if(!ownerId || !title )
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
        teamid,
        ownerId,
        status,
        createdAt,
        updatedate,
    });
    return res.status(201).json({msg : "Project created successfully",Newproject});
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
module.exports={CreateProject,Getallprojects};
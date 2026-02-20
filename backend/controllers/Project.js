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
    const ownerId=req.user.id;
    const Newproject= await Project.create({
        title,
        ownerId:ownerId,
        members:[ownerId],
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
async function addmembers(req,res)
{
    try{
        const userId=req.user.id;
       const {id}=req.params;
       const{email}=req.body;
       
       const Projectexists=await Project.findById(id)
       .populate("members","name email");
       if(!Projectexists)
       {
        return res.status(404).json({msg:"Project not found",success:false});
       }
       
      if(Projectexists.ownerId.toString()!==userId)
      {
        return res.status(401).json({msg:"Only owners can add members",success:false});
      }
      const user=await User.findOne({email});
      if(!user)
      {
        return res.status(404).json({msg:"User not found",success:false});
      }
      if(Projectexists.members.some(
        member=>member._id.toString()===user._id.toString()
      ))
      {
        return res.status(409).json({msg:"user already a member",success:false});
      }
      Projectexists.members.push(user._id);
      await Projectexists.save();
      console.log("Updated Project is : ",Projectexists);
      console.log("Project members : ",Projectexists.members);
      return res.status(201).json({msg:"User added successfully to the team",Project:Projectexists,success:true})
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function yourprojects(req,res)
{
    try{
        const id=req.user.id;
        const yourproject=await Project.find({
            ownerId:id,
        });
        if(yourproject.length===0)
        {
            return res.status(404).json({msg:"You havent created any project",success:false});
        }
        console.log(id);
        console.log("Your projects are : ",yourproject);
        return res.status(200).json({msg:"Project fetched successfully",myproject:yourproject,success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Interal server error",success:false});
    }
}
async function getprojectbyId(req,res){
    try{
       const {id}=req.params;
       const projectinfo=await Project.findById(id)
       .populate("members","name email")
       .populate("ownerId","name email");
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
         return res.status(200).json({msg:"Project deleted successfully",deletedproject,success:true,})
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
module.exports={CreateProject,Getallprojects,getprojectbyId,deleteproject,yourprojects,addmembers};
const Work=require("../model/Work");
const Project=require("../model/project");
const User=require("../model/User");
const ResearchTask=require("../model/ResearchTask");

async function CreateTask(req,res)
{
    try{
      const{projectId,workId}=req.params;
      const{description}=req.body;
      if(!description)
      {
        return res.status(409).json({msg:"Please enter the task",success:false});
      }
      const user=await User.findById(req.user.id);
      const Projectexists=await Project.findById(projectId);
      if(!Projectexists)
      {
        return res.status(404).json({msg:"Project does not exists",success:false});
      }
      const Leader=Projectexists.ownerId;
      if(user._id.toString()!==Leader.toString())
      {
        return res.status(401).json({msg:"Only team leaders can create task",success:false});
      }
        const newTask=await ResearchTask.create({
            description:description,
            workId:workId,
            projectId:projectId,
            createdby:req.user.id,
        });
      
      return res.status(200).json({msg:"Task created successfully",Task:newTask,success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function GetallTasks(req,res)
{
    try{
        const{workId,projectId}=req.params;
        const Projectexists=await Project.findById(projectId);
        if(!Projectexists)
        {
            return res.status(404).json({msg:"No project exists",success:false});
        }
        const workexists=await Work.findById(workId);
        if(!workexists)
        {
            return res.status(404).json({msg:"No research exists",success:false});
        }
        const Tasks=await ResearchTask.find({projectId,workId});
        if(Tasks.length==0)
        {
            return res.status(200).json({msg:"No task created",success:true});
        }
        return res.status(200).json({msg:"Tasks fetched successfully",Tasks:Tasks,success:true});
        
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function DeleteTask(req,res)
{
  
    try{
      console.log("Delete route hit");
  console.log(req.params);
      const {TaskId,projectId,workId}=req.params;
      const Projectexists=await Project.findById(projectId);
      if(!Projectexists)
      {
        return res.status(404).json({msg:"Team does not exists",success:false});
      }
      const researchexists=await Work.findById(workId);
      if(!researchexists)
      {
        return res.status(404).json({msg:"Research does not exists",syccess:false});
      }
      const Taskexists=await ResearchTask.findById(TaskId);
      if(!Taskexists)
      {
        return res.status(404).json({msg:"Task does not exists",success:false});
      }
      await ResearchTask.findByIdAndDelete(TaskId);
      return res.status(200).json({msg:"Task deleted successfully",success:true});
    }catch(error)
    {
       console.log(error);
       return res.status(500).json({msg:"Internal server error",success:false});
    }
}
module.exports={CreateTask,GetallTasks,DeleteTask};
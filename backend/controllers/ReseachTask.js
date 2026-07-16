const Work=require("../model/Work");
const Team=require("../model/Team");
const User=require("../model/User");
const ResearchTask=require("../model/ResearchTask");
const SavedRepo=require("../model/SavedRepo");
const Profile = require("../model/Profile");
async function CreateTask(req,res)
{
    try{
      const{TeamId,workId}=req.params;
      const{description}=req.body;
      if(!description)
      {
        return res.status(409).json({msg:"Please enter the task",success:false});
      }
      const user=await User.findById(req.user.id);
      const Teamexists=await Team.findById(TeamId);
      if(!Teamexists)
      {
        return res.status(404).json({msg:"Team does not exists",success:false});
      }
      const Leader=Teamexists.ownerId;
      if(user._id.toString()!==Leader.toString())
      {
        return res.status(401).json({msg:"Only team leaders can create task",success:false});
      }
        const newTask=await ResearchTask.create({
            description:description,
            workId:workId,
            TeamId:TeamId,
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
        const{workId,TeamId}=req.params;
        const Teamexists=await Team.findById(TeamId);
        if(!Teamexists)
        {
            return res.status(404).json({msg:"No Team exists",success:false});
        }
        const workexists=await Work.findById(workId);
        if(!workexists)
        {
            return res.status(404).json({msg:"No research exists",success:false});
        }
        const Tasks=await ResearchTask.find({TeamId,workId}).populate("relatedrepos","name repourl")
        .populate("assignedto","name email");
        if(Tasks.length==0)
        {
            return res.status(200).json({msg:"No task created",success:true});
        }
        const assigneduserIds=Tasks.filter(
          task=>task.assignedto
        )
        .map(task=>task.assignedto._id);
        const profiles=await Profile.find({
          userId:{$in:assigneduserIds},
        });
        const profilemap={};
        profiles.forEach(profile=>
           profilemap[profile.userId.toString()]=profile.photo,
        );
        const taskswithphotos=Tasks.map(task=>({
          ...task.toObject(),
          assignedphoto:task.assignedto ?
          profilemap[task.assignedto._id.toString()]|| null : null,
        }))
        return res.status(200).json({msg:"Tasks fetched successfully",Tasks:taskswithphotos,success:true});
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
      const {TaskId,TeamId,workId}=req.params;
      const Teamexists=await Team.findById(TeamId);
      if(!Teamexists)
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
async function AddSavedRepositories(req,res)
{
     try{
        const{TeamId,workId,TaskId,repoId}=req.params;
        
        
        const taskexists=await ResearchTask.findById(TaskId);
        if(!taskexists)
        {
          return res.status(404).json({msg:"Task does not exists",success:false});
        } 
        await ResearchTask.findByIdAndUpdate(
    TaskId,
    {
        $addToSet: { relatedrepos: repoId }
    }
);
        return res.status(201).json({msg:"Added this saved repository to related repository",success:true});
     }catch(error)
     {
      console.log(error);
      return res.status(500).json({msg:"Internal server error",success:false});
     }
}
async function assignTask(req,res)
{
  try{
       const{TeamId,workId,TaskId,memberId}=req.params;
       const Teamexists=await Team.findById(TeamId);
       if(!Teamexists)
       {
        return res.status(404).json({msg:"Team does not exists",success:false});
       }
       const workexists=await Work.findById(workId);
       if(!workexists)
       {
        return res.status(404).json({msg:"Research topic does not exists",success:false});
       }
       const taskexists=await ResearchTask.findById(TaskId);
       if(!taskexists)
       {
        return res.status(404).json({msg:"Task does not exist",success:false});
       }
       const isMember=Teamexists.members.some(
        member=>member._id.toString()==memberId,
       );
       if(!isMember)
       {
        return res.status(400).json({msg:"User is not a member of this Team"});
       }

       const profile=await Profile.findOne({
        userId:memberId,
       });
      
       taskexists.assignedto=memberId;
       await taskexists.save();
       return res.status(200).json({msg:"Task successfully assigned to the member",success:true});

  }catch(error)
  {
    return res.status(500).json({msg:"Internal sercver error",success:true});
  }
}
module.exports={CreateTask,GetallTasks,DeleteTask,AddSavedRepositories,assignTask};
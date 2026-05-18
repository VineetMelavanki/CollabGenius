const {Notifications}=require("../model/Notifications");
const project=require("../model/project")
async function getrequests(req,res)
{
   try{
      const userId=req.user.id; 
      const Notification=await Notifications.find({receiver:userId})
      .populate("sender","name email")
      .populate("project","title ownerId");
      if(Notification.length===0)
      {
         return res.status(200).json({msg:"No notifications received",Notify:[],success:true});
      }
      
      return res.status(200).json({msg:"Notification available",Notify:Notification,success:true});
   }catch(error)
   {
      console.log(error);
      return res.status(500).json({msg:"Internal server error",success:false});
   }
   
}
async function acceptrequest(req,res)
{
   try{
      const {projectId}=req.params;
      const userId=req.user.id;
      const notification=await Notifications.findOne({
         receiver:userId,
         project:projectId,
      });
      if(!notification)
      {
         return res.status(404).json({msg:"Notification not found",success:false});
      }
      const projectexists=await project.findById(projectId);
      if(!projectexists)
      {
         return res.status(404).json({msg:"Project not found",success:false});
      }

      // Add user to the project members array if not already present
      if (!projectexists.members.includes(userId)) {
         projectexists.members.push(userId);
         await projectexists.save();
      }
      
      await Notifications.findByIdAndDelete(notification._id);
      
      return res.status(200).json({msg:"Successfully joined the team",project:projectexists,success:true});
   }catch(error)
   {
         console.log(error);
         return res.status(500).json({msg:"Internal server error",success:false});
   }
}
async function declinereq(req,res)
{
   try{
    const {projectId}=req.params;
   const userId=req.user.id;
   const notification=await Notifications.findOne({
      receiver:userId,
      project:projectId,
     
   });
   if(!notification)
   {
      return res.status(404).json({msg:"No notification found",success:false});
   }
   const projectexists=await project.findById(projectId);
   if(!projectexists)
   {
      return res.status(404).json({msg:"Project not found",success:false});
   }
   await Notifications.findByIdAndDelete(notification._id);

    return res.status(200).json({msg:"Request declined",success:true});
   }catch(errpr)
   {
      return res.status(500).json({msg:"Internal server error",success:false});
   }
   
}
module.exports={getrequests,acceptrequest,declinereq};

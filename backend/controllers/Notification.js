const {Notifications}=require("../model/Notifications");
const Team=require("../model/Team");
const User=require("../model/User");
async function getrequests(req,res)
{
   try{
      const userId=req.user.id; 
      const Notification=await Notifications.find({receiver:userId})
      .populate("sender","name email")
      .populate("Team","title ownerId");
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
      const {TeamId}=req.params;
      const userId=req.user.id;
      console.log("req.params:", req.params);
console.log("TeamId:", TeamId);
console.log("typeof TeamId:", typeof TeamId);
      const notification=await Notifications.findOne({
         receiver:userId,
         Team:TeamId,
      });
      if(!notification)
      {
         return res.status(404).json({msg:"Notification not found",success:false});
      }
      const Teamexists=await Team.findById(TeamId);
      if(!Teamexists)
      {
         return res.status(404).json({msg:"Team not found",success:false});
      }

      // Add user to the Team members array if not already present
      if (!Teamexists.members.includes(userId)) {
         Teamexists.members.push(userId);
         await Teamexists.save();
      }
      
      await Notifications.findByIdAndDelete(notification._id);
      
      return res.status(200).json({msg:"Successfully joined the team",Team:Teamexists,success:true});
   }catch(error)
   {
         console.log(error);
         return res.status(500).json({msg:"Internal server error",success:false});
   }
}
async function declinereq(req,res)
{
   try{
    const {TeamId}=req.params;
   const userId=req.user.id;
   const notification=await Notifications.findOne({
      receiver:userId,
      Team:TeamId,
     
   });
   if(!notification)
   {
      return res.status(404).json({msg:"No notification found",success:false});
   }
   const Teamexists=await Team.findById(TeamId);
   if(!Teamexists)
   {
      return res.status(404).json({msg:"Team not found",success:false});
   }
   await Notifications.findByIdAndDelete(notification._id);

    return res.status(200).json({msg:"Request declined",success:true});
   }catch(errpr)
   {
      return res.status(500).json({msg:"Internal server error",success:false});
   }
   
}
module.exports={getrequests,acceptrequest,declinereq};

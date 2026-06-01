const Request=require("../model/Request");
const User=require("../model/User");
const Project=require("../model/project");

async function sendRequest(req,res)
{
    try{
        const{projectId}=req.params;
        const user=await User.findById(req.user.id);
       const project=await Project.findById(projectId).populate("ownerId","name email");
       if(!project)
        {
            return res.status(404).json({msg:"Team does not exists",success:false});
        }
       const receiver=project.ownerId._id;
       const isMember=project.members.some((member)=>{
        return member.toString()===user._id.toString();
       });
       if(isMember)
       {
        return res.status(401).json({msg:"User is already an member of the team",success:false});
       }
       const newRequest=await Request.create({
        sender:user._id,
        receiver:receiver,
        projectId:projectId,
        message:"has requested to join your team"
       });
       return res.status(200).json({msg:"Request sent successfully",request:newRequest,success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function getallRequests(req,res)
{
    try{
        const user=req.user.id;
        const Requests=await Request.find({receiver:user}).
        populate("sender","name email")
        .populate("receiver","name email")
        .populate("projectId","title");
        if(Requests.length===0)
        {
            return res.status(404).json({msg:"No request found",success:false});
        }
        return res.status(200).json({msg:"All requests found",allrequest:Requests,success:true});
    }catch(error)
    {
       console.log(error);
       return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function acceptRequest(req,res)
{
    try{
        const{senderId,projectId}=req.params;
        const user=await User.findById(senderId);
        if(!user)
        {
            return res.status(404).json({msg:"User does not exists",success:false});
        }
        const request=await Request.findOne({
            sender:senderId,
            projectId:projectId,
        });
        if(!request)
        {
            return res.status(404).json({msg:"Request not found",success:false});
        }
        const project=await Project.findById(projectId);
        if(!project)
        {
            return res.status(404).json({msg:"Project does not exists",success:false});
        }
         const isMember=project.members.some(
            member=>member._id.toString()===user._id.toString(),
         );
         if(!isMember)
         {
            project.members.push(user._id);
            await project.save();
         }
         await Request.findByIdAndDelete(request._id);
         return res.status(200).json({msg:"Request accepted",success:true});
    }catch(error)
    {
         return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function declineRequest(req,res)
{
    try{
        const{senderId,projectId}=req.params;
        const user=await User.findById(senderId);
        const request=await Request.findOne({
            sender:senderId,
            projectId:projectId,
        });
        if(!request)
        {
            return res.status(404).json({msg:"Request not found",success:false});
        }
        await Request.findByIdAndDelete(request._id);
        return res.status(200).json({msg:"Request rejected",success:true});
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
module.exports={sendRequest,getallRequests,acceptRequest,declineRequest};
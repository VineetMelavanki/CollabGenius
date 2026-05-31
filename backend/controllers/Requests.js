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
        message:`${user.name} has requested to join your team ${project.title}`
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
        const Requests=await Request.find({receiver:user});
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
module.exports={sendRequest,getallRequests};
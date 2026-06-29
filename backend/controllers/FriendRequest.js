const User=require("../model/User");
const Profile=require("../model/Profile");
const FriendRequest=require("../model/FriendReq");

async function SendFriendRequest(req,res)
{
    try{
      const{profileId,receiverId}=req.params;
      console.log("Profile Id : ",profileId);
      console.log("Receiver Id : ",receiverId);
      const Profileexists=await Profile.findById(profileId);
      if(!Profileexists)
      {
        return res.status(404).json({msg:"Profile does not exists",success:false});
      }
      if(receiverId.toString()===req.user.id.toString())
      {
        return res.status(409).json({msg:"User cannot send friend request to himself"});
      }
      const existingrequest=await FriendRequest.findOne({
        sender:req.user.id,
        receiver:receiverId,
      });
      if(existingrequest)
      {
        return res.status(409).json({msg:"Friend request already sent",sucess:false});
      }

      const newRequest=await FriendRequest.create({
        profile:profileId,
        sender:req.user.id,
        receiver:receiverId,
        message:"has sent you a friend request",
      });
      return res.status(201).json({msg:"Friend Request Sent successfully",Request:newRequest,sender:req.user.id,success:true});
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function fetchAllfriendRequests(req,res)
{
    try{
       const allrequests=await FriendRequest.find({receiver:req.user.id}).populate("sender","name email").populate("receiver","name email").populate("profile","photo");
       const profilephotos={};
       await Promise.all(
        allrequests.map(async(request)=>{
            const senderProfile=await Profile.findOne({userId:request.sender._id}).select("photo");
            profilephotos[request.sender._id.toString()]=senderProfile?.photo?.url;
        })
       );
       if(allrequests.length===0)
       {
        return res.status(200).json({msg:"No requests found",success:true});
       }
       return res.status(200).json({msg:"ALL friend Requests fetched successfully",Requests:allrequests,Senderphotos:profilephotos,success:true});
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:true});
    }
}
async function acceptFriendRequest(req,res)
{
    try{
        const{requestId}=req.params;
        const friendRequestexists=await FriendRequest.findById(requestId);
        if(!friendRequestexists)
        {
            return res.status(404).json({msg:"No friend request exists",success:false});
        }
        const senderId=friendRequestexists.sender;
        const receiverProfile=await Profile.findOne({userId:req.user.id});
        const senderprofile=await Profile.findOne({userId:senderId});
        if(!senderprofile)
        {
            return res.status(404).json({msg:"Sender does not exists",success:false});
        }
        const isFriend=receiverProfile.friends.some(
            friend=>friend._id.toString()==senderId.toString(),
        );
        if(isFriend)
        {
            return res.status(409).json({msg:"request sender is already a friend",success:false});
        }
        receiverProfile.friends.push(senderId);
        senderprofile.friends.push(req.user.id);
        await receiverProfile.save();
        await senderprofile.save();
        await FriendRequest.findByIdAndDelete(requestId);

        return res.status(200).json({msg:"Request accepted successfully",success:true});
    }catch(error)
    {
        console.log("The error is : ",error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function declineFriendRequest(req,res)
{
    try{
        const{requestId}=req.params;
        const friendRequestexists=await FriendRequest.findById(requestId);
        if(!friendRequestexists)
        {
            return res.status(404).json({msg:"No friend request exists",success:false});
        }   
        await FriendRequest.findByIdAndDelete(requestId);
        return res.status(200).json({msg:"Request declined successfully",success:true});
    }catch(error)
    {
        console.log("The error is : ",error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
module.exports={SendFriendRequest,fetchAllfriendRequests,acceptFriendRequest,declineFriendRequest};
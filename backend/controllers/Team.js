const User=require("../model/User");
const {Notifications}=require("../model/Notifications")
const Profile=require("../model/Profile");
const Team = require("../model/Team");
async function CreateTeam(req,res)
{
    console.log("The id of owner is : ",req.user.id)
    try{
    const{title,status ,createdAt, updatedate}=req.body;
    if(!title)
    {
        return res.status(400).json({msg : "All fields are required ", success : false});
    }
    const Titlexists = await Team.findOne({title});
    if(Titlexists)
    {
        return res.status(409).json({msg : "Team Title already exists ",success : false});
    }
    const ownerId=req.user.id;
    const NewTeam= await Team.create({
        title,
        ownerId:ownerId,
        members:[ownerId],
        status,
        createdAt,
        updatedate,
    });
    return res.status(201).json({msg : "Team created successfully",Team: NewTeam});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg :" Internal server error",success : false, error : error.message});
    }
}
async function GetallTeams(req,res)
{
    try{
        const allTeam= await Team.find({});
        
        return res.status(200).json({success : true , msg : allTeam.length ? "Teams fetched successfully" : "Teams not found",Teams: allTeam,length:allTeam.length});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg : "Internal server error ",success : false, error : error.message});
    }
}
async function getTeamBytitle(req,res)
{
    try{
        const {title}=req.query;
        if(!title)
        {
            return res.status(409).json({msg:"Please enter a title",success:false});
        }
        const Teams=await Team.find({
            title:{$regex:title,$options:"i"}
        }).select("_id title description ");
        if(Teams.length===0)
        {
            return res.status(404).json({msg:"No Team by this title exists",success:false});
        }
        return res.status(200).json({msg:"Teams/Team found successfully",Teamdata:Teams,success:true})
    }catch(error)
    {
         console.log(error);

         return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function IsMember(req,res)
{
    try{
     const{TeamId}=req.params;
     const user=await User.findById(req.user.id);

     const team=await Team.findById(TeamId);

     if(!team)
     {
        return res.status(404).json({msg:"Team does not exists",success:false});
     }
     const isMember=team.members.some((member)=>{
       return member.toString()===user._id.toString();
     });

     if(!isMember)
     {
        return res.status(401).json({msg:"You not a member of this Team",success:false,isMember:false});
     }
     return res.status(200).json({msg:"User is a member of the Team",isMember:true,success:true});
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function addmembers(req,res)
{
    try{
        const userId=req.user.id;
       const {id}=req.params;
       const{email}=req.body;
       
       const Teamexists=await Team.findById(id)
       .populate("members","name email");
       if(!Teamexists)
       {
        return res.status(404).json({msg:"Team not found",success:false});
       }
       
      if(Teamexists.ownerId.toString()!==userId)
      {
        return res.status(401).json({msg:"Only owners can add members",success:false});
      }
      const user=await User.findOne({email});
      if(!user)
      {
        return res.status(404).json({msg:"User not found",success:false});
      }
      const isMember=await Teamexists.members.some((member)=>member._id.toString()===user._id.toString());
      if(isMember)
      {
        return res.status(400).json({msg:"User already an member",success:false});
      }
      const Notificationexists=await Notifications.findOne({
        receiver:user._id,
        sender:userId,
        Team:Teamexists._id,
        status:"pending",
      });
      if(Notificationexists)
      {
        return res.status(401).json({msg:"Invitation already sent ",success:false});
      }
      const Notify=await Notifications.create({
        receiver:user._id,
        sender:userId,
        message:`You have been invited to join ${Teamexists.title}`,
        Team:Teamexists._id,
      });

      return res.status(201).json({msg:"Invitation Sent successfully",notify:Notify,success:true})
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function removemember(req,res)
{
    try{ 
      const {TeamId,memberId}=req.params;
      
      const Team=await Team.findById(TeamId)
      .populate("members","name email _id");
      if(!Team)
      {
        return res.status(404).json({msg:"Team not found ",success:false});
      }
      const user=req.user.id;
      if(Team.ownerId.toString()!==user)
      {
        return res.status(409).json({msg:"Only Team leader can remove a member",success:false});
      }
      if(memberId===Team.ownerId.toString())
      {
        return res.status(409).json({msg:"owner cannot be removed",success:false});
      }
      Team.members=Team.members.filter(
        member=>member._id.toString()!==memberId
      );
      await Team.save();
      return res.status(200).json({msg:"Member removed successfully",newTeam:Team,success:true})
    }catch(error)
    {
      return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function yourTeams(req,res)
{
    try{
        const id=req.user.id;
        const yourTeam=await Team.find({
            ownerId:id,
        });
        if(yourTeam.length===0)
        {
            return res.status(404).json({msg:"You havent created any Team",success:false});
        }
        console.log(id);
        console.log("Your Teams are : ",yourTeam);
        return res.status(200).json({msg:"Team fetched successfully",myTeam:yourTeam,success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Interal server error",success:false});
    }
}
async function getTeambyId(req,res){
    try{
       const {id}=req.params;
       const Teaminfo=await Team.findById(id)
       .populate("members","name email")
       .populate("ownerId","name email");
       if(!Teaminfo)
       {
        return res.status(404).json({msg:"Team Not found",success:false});
       }
       
       return res.status(200).json({msg:"Team found",Teamdata:Teaminfo,success:true});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function deleteTeam(req,res)
{
    try{
         const{id}=req.params;
         const deletedTeam=await Team.findByIdAndDelete({
            _id:id,
            ownerId:req.user.id
         });
         if(!deletedTeam)
         {
            return res.status(404).json({msg:"Team does not exists",success:false});
         }
         return res.status(200).json({msg:"Team deleted successfully",deletedTeam,success:true,})
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function getjoinedTeam(req,res)
{
    try{
      const {id}=req.params;
      const Teams=await Team.find({
        $or:[
            {members:id},
            {ownerId:id},
        ],
      });
      if(Teams.length==0)
      {
        return res.status(404).json({msg:"User hasn't joined or created any team",success:false});
      }
      return res.status(200).json({msg:"All team fetched successfully",Teams:Teams,success:true});
    }catch(error)
    {
       return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function Ownerverify(req,res)
{
    try{
        const{TeamId}=req.params;
        const Teamexists=await Team.findById(TeamId);
        
        if(!Teamexists)
        {
            return res.status(404).json({msg:"Team does not exists",success:false});
        }
        const isLeader=Teamexists?.ownerId.toString()===req.user.id.toString();
        return res.status(200).json({success:true,isLeader:isLeader,msg :isLeader?"User is the leader":"User is not the leader"});
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
async function getallmembers(req,res)
{
    try{
        const{TeamId}=req.params;
        const Teamexists=await Team.findById(TeamId).populate("members","name email");
        if(!Teamexists)
        {
            return res.status(404).json({msg:"Team does not exists",success:false});
        }
       
        const memberIds=Teamexists.members.map(
            member=>member._id
        );
        const profiles=await Profile.find({
            userId:{$in:memberIds}
        });
        const profilemap={};
        profiles.forEach(profile=>
           profilemap[profile.userId.toString()]=profile.photo
        );
        const members=Teamexists.members.map(member=>({
            ...member.toObject(),
            photo:profilemap[member._id.toString()]|| null
        }));
        return res.status(200).json({msg:"Members fetched successfully",members:members,success:true});
    }catch(error)
    {
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}
module.exports={CreateTeam,GetallTeams,getTeambyId,deleteTeam,yourTeams,addmembers,removemember,getTeamBytitle,IsMember,getjoinedTeam,Ownerverify,getallmembers};
const Team= require("../model/Team");
const User= require("../model/User");
async function CreateTeam(req,res)
{
   try {
    const{name,owner,members,roles}= req.body;
    if(!owner || !name )
    {
        return res.status(400).json({msg : "owner and team name is required ",success : false});
    }
    const Teamname= await Team.findOne({name});
    if(Teamname)
    {
        return res.status(409).json({msg : "Team already exists "});
    }
    const ownerexists =await User.findById(owner);
    if(!ownerexists)
    {
        return res.status(404).json({msg : "Owner does not exists "});
    }
    let memberIds=[];
    if(Array.isArray(members) && members.length > 0)
    {
        memberIds=members;
    }
    const rolemap= new Map();
    rolemap.set(owner,'admin');
    if(memberIds.length > 0)
    {
        memberIds.forEach(id=>{
            if(id!=owner)
            {
                rolemap.set(id,'editor');
            }
        });
    }
    const newTeam = await Team.create({
        name,
        owner,
        roles: rolemap,
        members : membersIds,
    });
    return res.status(201).json({msg : "Team created successfully ", success : true });
   }catch(error)
   {
     console.log("Error in team creation ",error );
     return res.status(500).json({success : false , msg : "Error team creating ", error : error.message});
   }
   
}

async function GetTeamById(req,res)
{
    try{
        const {TeamId}=req.params;
        const Teamexists= await Team.findById(TeamId);
        if(!Teamexists)
        {
            return res.status(404).json({msg : "Team does not exists ",success : false});
        }
        return res.status(200).json(Teamexists);
    }catch(error)
    {
        console.log("Error in finding team ",error);
        return res.status(500).json({msg : "Internal server error  ",success : false , error : error.message});
    }
}
async function Memberofwhichteam(req,res)
{
    try {
    const {userId}= req.params;
    const teams= await Team.find({
        $or:[
            {owner : userId},
            {members : userId},
        ]
    });
    return res.status(200).json({status : "success", teams, count : teams.length});
}catch(error)
{
    console.log("Error of detecting member belong to whivh team ", error);
    return res.status(500).json({msg :"Error in member detection ", success : false , error: error.message});
}
}
async function GetAllTeams(req,res)
{
    try{
    const AllTeams= await Team.find({});
    return res.status(200).json({msg : AllTeams.length ? "Team exists" : "No Team exists",data : AllTeams,success : true});
}catch(error)
{
    console.log(error);
    return res.status(500).json({msg :"Internal server error ", success : false , error : error.message });
}
}
async function ChangeMemberRole(req,res)
{
    const MyRole =new Map();

    const {TeamId}= req.params;
    const{UserId}=req.params;
    const NewRole = await User.findByIdAndUpdate(MyRole.set(UserId,'Admin'));
    return res.status(200).json(NewRole);
}
module.exports={CreateTeam,GetTeamById,Memberofwhichteam,GetAllTeams};
const Team= require("../model/Team");
const User= require("../model/User");
async function CreateTeam(req,res)
{
    const {name,owner,roles,members}= req.body;
    if(!name ||!owner)
    {
        return res.status(400).json({msg : "All fields are required"});
    }

    let memberIds=[];
    if(Array.isArray(members) &&members.length >0)
    {
        memberIds=members;
    }
    const existingTeam = await Team.findOne({name});
    //validate if team exists
    if(existingTeam)
    {
        return res.status(409).json({msg : "Team already exists"});
    }
    //validate if owner exist
    const Ownerexists = await User.findById(owner);
    if(!Ownerexists)
    {
        return res.status(400).json({msg:"Owner does not exists as user "});
    }
    const RoleMap= new Map();
    RoleMap.set(owner,'admin');
    if(memberIds.length >0 )
    {
        memberIds.forEach(id => {
            if(id!=owner)
            {
                RoleMap.set(id,'editor');
            }
        });
    }
    const NewTeam= await Team.create({
        name,
        owner,
        roles :RoleMap,
        members : memberIds,

    });
    console.log("Result ",NewTeam);
    return res.status(201).json({status :"success"});
}

async function GetTeamById(req,res)
{
    const {TeamId}= req.params
    const Team = await Team.findById(TeamId);
    if(!Team)
    {
        return res.status(400).json({msg : "Team does not exists"});
    }
    return res.status(200).json(Team);
}
async function Memberofwhichteam(req,res)
{
    const {userId}= req.params;
    const teams= await Team.find({
        $or:[
            {owner : userId},
            {members : userId},
        ]
    });
    return res.status(200).json({status : "success"});
}
async function GetAllTeams(req,res)
{
    const AllTeams= await Team.find({});
    return res.status(200).json(AllTeams);
}
async function ChangeMemberRole(req,res)
{
    const MyRole =new Map();

    const {TeamId}= req.params;
    const{UserId}=req.params;
    const NewRole = await User.findByIdAndUpdate(MyRole.set(UserId,'Admin'));
}
module.exports={CreateTeam,GetTeamById,Memberofwhichteam,GetAllTeams};
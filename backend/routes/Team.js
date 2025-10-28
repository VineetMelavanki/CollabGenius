const express= require("express");
const {CreateTeam,GetTeamById,Memberofwhichteam,GetAllTeams} =require("../controllers/Team");
const TeamRouter= express.Router();
TeamRouter.get("/allteams",GetAllTeams);
TeamRouter.get("/Teamid",GetTeamById);
TeamRouter.get("/memberinfo",Memberofwhichteam);
module.exports=TeamRouter;



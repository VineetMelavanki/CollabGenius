const express= require("express");
const {CreateTeam,GetTeamById,Memberofwhichteam,GetAllTeams} =require("../controllers/Team");
const TeamRouter= express.Router();
TeamRouter.post("/Createteam",CreateTeam);
TeamRouter.get("/allteams ",GetAllTeams);
TeamRouter.get("/:id",GetTeamById);
TeamRouter.get("/memberinfo",Memberofwhichteam);
module.exports=TeamRouter;



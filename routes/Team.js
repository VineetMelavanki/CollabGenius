const express= require("express");
const {CreateTeam,GetTeamById,Memberofwhichteam,GetAllTeams,ViewTeam} =require("../controllers/Team");
const {authmiddleware} = require("../middleware/authmiddleware");

const TeamRouter= express.Router();

TeamRouter.get("/allteams",GetAllTeams);
TeamRouter.get("/memberinfo",authmiddleware, Memberofwhichteam);
TeamRouter.get("/:Teamid",authmiddleware,GetTeamById);
TeamRouter.post("/CreateTeam",authmiddleware,CreateTeam);
TeamRouter.get("/View-Team",authmiddleware,ViewTeam);
module.exports=TeamRouter;

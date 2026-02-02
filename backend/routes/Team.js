const express= require("express");
const {CreateTeam,GetTeamById,Memberofwhichteam,GetAllTeams,ViewTeam} =require("../controllers/Team");
const {authmiddleware} = require("../middleware/authmiddleware");

const TeamRouter= express.Router();

TeamRouter.post("/CreateTeam",authmiddleware,CreateTeam);
TeamRouter.get("/View-Team",authmiddleware,ViewTeam);
TeamRouter.get("/allteams",GetAllTeams);
TeamRouter.get("/memberinfo",authmiddleware, Memberofwhichteam);
// Dynamic routes last
TeamRouter.get("/:Teamid",authmiddleware,GetTeamById);

module.exports=TeamRouter;

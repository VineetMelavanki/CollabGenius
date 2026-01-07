const express= require("express");
const {CreateTeam,GetTeamById,Memberofwhichteam,GetAllTeams} =require("../controllers/Team");
const {authmiddleware} = require("../middleware/authmiddleware");
const{validateteamcreation}=require("../middleware/validator");
const TeamRouter= express.Router();
TeamRouter.get("/allteams",GetAllTeams);
TeamRouter.get("/:Teamid",authmiddleware,GetTeamById);
TeamRouter.get("/memberinfo",authmiddleware, Memberofwhichteam);
TeamRouter.post("/CreateTeam",authmiddleware,validateteamcreation,CreateTeam);
module.exports=TeamRouter;



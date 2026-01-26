const express=require("express");
const {CreateTeam} =require("../controllers/Team");
const dashrouter=express.Router();
dashrouter.post("/CreateTeam",CreateTeam)
module.exports= dashrouter;
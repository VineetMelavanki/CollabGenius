const express=require("express");
const {CreateTeam} =require("../controllers/Team");
const {authmiddleware} = require("../middleware/authmiddleware");
const dashrouter=express.Router();
dashrouter.post("/CreateTeam",authmiddleware,CreateTeam)
module.exports= dashrouter;
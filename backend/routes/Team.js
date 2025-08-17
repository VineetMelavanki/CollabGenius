const express= require("express");
const {CreateTeam} =require("../controllers/Team");
const TeamRouter= express.Router();
TeamRouter.route("/new")
.post(CreateTeam);

module.exports=TeamRouter;



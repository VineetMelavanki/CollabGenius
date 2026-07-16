const express =require("express");
const {CreateTeam,GetallTeams,getTeambyId,deleteTeam,yourTeams,addmembers,removemember,getTeamBytitle,IsMember,getjoinedTeam,Ownerverify,getallmembers}=require("../controllers/Team");
const {authmiddleware} =require("../middleware/authmiddleware")
const TeamRouter = express.Router();
TeamRouter.post("/Create-Team",authmiddleware,CreateTeam);
TeamRouter.get("/getallTeams",authmiddleware,GetallTeams);
TeamRouter.delete("/delete/:id",authmiddleware,deleteTeam);
TeamRouter.get("/get-Team/:id",authmiddleware,getTeambyId);
TeamRouter.get("/your-Teams",authmiddleware,yourTeams);
TeamRouter.get("/get-Team-by-title",authmiddleware,getTeamBytitle);
TeamRouter.post("/Add-members/:id",authmiddleware,addmembers);
TeamRouter.get("/is-Member/:TeamId",authmiddleware,IsMember);
TeamRouter.delete("/remove-member/:TeamId/:memberId",authmiddleware,removemember);
TeamRouter.get("/get-joined-team/:id",authmiddleware,getjoinedTeam);
TeamRouter.get("/verify-Leader/:TeamId",authmiddleware,Ownerverify);
TeamRouter.get("/all-members/:TeamId",authmiddleware,getallmembers);
module.exports=TeamRouter;
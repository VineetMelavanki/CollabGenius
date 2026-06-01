const express =require("express");
const {CreateProject,Getallprojects,getprojectbyId,deleteproject,yourprojects,addmembers,removemember,getprojectBytitle,IsMember,getjoinedTeam}=require("../controllers/Project");
const {authmiddleware} =require("../middleware/authmiddleware")
const ProjectRouter = express.Router();
ProjectRouter.post("/Create-Project",authmiddleware,CreateProject);
ProjectRouter.get("/getallprojects",authmiddleware,Getallprojects);
ProjectRouter.delete("/delete/:id",authmiddleware,deleteproject);
ProjectRouter.get("/get-project/:id",authmiddleware,getprojectbyId);
ProjectRouter.get("/your-projects",authmiddleware,yourprojects);
ProjectRouter.get("/get-project-by-title",authmiddleware,getprojectBytitle);
ProjectRouter.post("/Add-members/:id",authmiddleware,addmembers);
ProjectRouter.get("/is-Member/:projectId",authmiddleware,IsMember);
ProjectRouter.delete("/remove-member/:projectId/:memberId",authmiddleware,removemember);
ProjectRouter.get("/get-joined-team/:id",authmiddleware,getjoinedTeam);
module.exports=ProjectRouter;
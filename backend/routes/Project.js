const express =require("express");
const {CreateProject,Getallprojects,getprojectbyId,deleteproject,yourprojects,addmembers}=require("../controllers/Project");
const {authmiddleware} =require("../middleware/authmiddleware")
const ProjectRouter = express.Router();
ProjectRouter.post("/Create-Project",authmiddleware,CreateProject);
ProjectRouter.get("/getallprojects",authmiddleware,Getallprojects);
ProjectRouter.delete("/delete/:id",authmiddleware,deleteproject);
ProjectRouter.get("/get-project/:id",authmiddleware,getprojectbyId);
ProjectRouter.get("/your-projects",authmiddleware,yourprojects);
ProjectRouter.post("/Add-members/:id",authmiddleware,addmembers);
module.exports=ProjectRouter;